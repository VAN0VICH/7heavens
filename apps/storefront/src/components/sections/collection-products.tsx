import {
	getProductsByCollectionHandle,
	getProductsByIds,
} from "@/data/medusa/products";
import { getRegion } from "@/data/medusa/regions";

import type { ModularPageSection } from "./types";

import CarouselSection from "../shared/carousel-section";
import ProductCard from "../shared/product-card";
import Heading from "../shared/typography/heading";

export default async function CollectionProducts(
	props: ModularPageSection<"section.collection">,
) {
	const region = await getRegion(props.countryCode);

	if (!region) {
		console.log("region", region);
		console.log("countryCode", props.countryCode);
		console.log("No region found");
		return null;
	}

	if (!props.handle) {
		return null;
	}

	const { products } = await getProductsByCollectionHandle(
		props.handle,
		region.id,
	);

	const slides = products.map((product, index) => (
		<ProductCard index={index} key={product.id} product={product} />
	));

	return (
		<section {...props.rootHtmlAttributes}>
			<CarouselSection
				cta={{ href: props.cta?.link, text: props.cta?.label }}
				slides={slides}
				title={
					<Heading
						className="text-center"
						desktopSize="3xl"
						mobileSize="lg"
						tag="h3"
					>
						{props.title}
					</Heading>
				}
			/>
		</section>
	);
}
