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
import type { Product, Variant } from "@blazzing-app/validators/client";
import { ProductInformation } from "./_parts/product-information";

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

	const variant = await getVariantByHandle(params.handle);
	if (!variant) {
		console.log("No variant found");
		return notFound();
	}
	const product = await getProductById(variant.productID);
	if (!product) {
		console.log("No product found");
		return notFound();
	}

	const content = await loadProductContent(params.handle);

	return (
		<>
			<section className="mx-auto flex max-w-max-screen flex-col items-start justify-start gap-s lg:flex-row lg:gap-xs lg:px-xl lg:py-m">
				<ProductImagesCarousel variant={variant as Variant} />
				<ProductInformation
					content={content}
					variant={variant as Variant}
					handle={params.handle}
					product={product as Product}
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
				product={product as Product}
				variant={variant as Variant}
			/>
		</>
	);
}
