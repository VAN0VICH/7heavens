import type { PageProps } from "@/types";
import type { ResolvingMetadata } from "next";

import { generateOgEndpoint } from "@/app/api/og/[...info]/utils";
import SectionsRenderer from "@/components/sections/section-renderer";
import { loadProductContent } from "@/data/sanity";
import { resolveSanityRouteMetadata } from "@/data/sanity/resolve-sanity-route-metadata";
import { notFound } from "next/navigation";

import {
	getProductById,
	getVariantByHandle,
} from "@/data/blazzing-app/product-and-variant";
import { ProductImagesCarousel } from "./_parts/image-carousel";
import StickyAtc from "./_parts/sticky-atc";
import type { StoreProduct, StoreVariant } from "@blazzing-app/validators";
import { ProductInformation } from "./_parts/product-information";
import { getCartId, getTempUserID } from "@/data/blazzing-app/cookies";

type ProductPageProps = PageProps<"countryCode" | "handle">;

export async function generateMetadata(
	props: ProductPageProps,
	parent: ResolvingMetadata,
) {
	const content = await loadProductContent((await props.params).handle);

	if (!content) {
		return notFound();
	}

	const url = generateOgEndpoint({
		countryCode: (await props.params).countryCode,
		handle: (await props.params).handle,
		type: "products",
	});

	const metadata = await resolveSanityRouteMetadata(
		{
			indexable: content?.indexable,
			pathname: content?.pathname,
			seo: content?.seo,
		},
		parent,
	);
	return {
		...metadata,
		openGraph: {
			images: [
				{
					height: 630,
					url: url.toString(),
					width: 1200,
				},
			],
		},
	};
}

export default async function ProductPage(props: ProductPageProps) {
	const params = await props.params;
	const cartID = await getCartId();
	const tempUserID = await getTempUserID();

	const variant = await getVariantByHandle(params.handle);
	if (!variant) {
		console.log("No variant found", variant);
		console.log("No variant found", JSON.stringify(variant));
		return notFound();
	}
	const product = await getProductById(variant.productID);
	if (!product) {
		console.log("No product found", variant.productID);
		return notFound();
	}

	const content = await loadProductContent(params.handle);

	return (
		<>
			<section className="mx-auto flex max-w-max-screen flex-col items-start justify-start gap-s lg:flex-row lg:gap-xs lg:px-xl lg:py-m lg:pb-40">
				<ProductImagesCarousel variant={variant as StoreVariant} />
				<ProductInformation
					content={content}
					variant={variant as StoreVariant}
					handle={params.handle}
					product={product as StoreProduct}
					cartID={cartID}
					tempUserID={tempUserID}
				/>
			</section>

			{content?.sections && (
				<SectionsRenderer
					countryCode={params.countryCode}
					fieldName="body"
					sections={content.sections}
				/>
			)}
			<StickyAtc
				handle={params.handle}
				product={product as StoreProduct}
				variant={variant as StoreVariant}
				cartID={cartID}
				tempUserID={tempUserID}
			/>
		</>
	);
}
