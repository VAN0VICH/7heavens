import type { ModularPageSection } from "./types";

import { getProductsByCollectionHandle } from "@/data/blazzing-app/product-and-variant";
import { cleanHandle } from "@/sanity/lib/utils";
import CarouselSection from "../shared/carousel-section";
import ProductCard from "../shared/product-card";
import Heading from "../shared/typography/heading";

export async function CollectionProducts(
	props: ModularPageSection<"section.collection">,
) {
	if (!props.handle) {
		return null;
	}

	const products = await getProductsByCollectionHandle(
		cleanHandle(props.handle)!,
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
