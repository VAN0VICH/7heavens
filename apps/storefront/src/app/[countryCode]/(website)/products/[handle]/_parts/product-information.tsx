import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";

import { ProductVariantsProvider } from "../product-context";
import AddToCart from "./add-to-cart";
import BreadCrumbs from "./breadcrumbs";
import OptionsSelect from "./options";
import ProductSpecs from "./specs";
import type { PRODUCT_QUERYResult } from "@/types/sanity.generated";
import type { Product, Variant } from "@blazzing-app/validators/client";
import { PriceDetail } from "./price";
import { Addons } from "./addons";

type Props = {
	content: PRODUCT_QUERYResult;
	variant: Variant;
	product: Product;
	handle: string;
};

export function ProductInformation({
	content,
	variant,
	product,
	handle,
}: Props) {
	return (
		<ProductVariantsProvider
			product={product}
			handle={handle}
			variant={variant}
		>
			<div className="lg:y-s flex w-full flex-col gap-lg px-m pb-2xl pt-s lg:max-w-[580px]">
				{/* <BreadCrumbs collection={props.collection} title={props.title} /> */}
				<Heading
					className="leading-[100%]"
					desktopSize="5xl"
					mobileSize="2xl"
					tag="h1"
				>
					{variant.title}
				</Heading>
				<PriceDetail variant={variant} />
				<Body
					className="font-normal"
					desktopSize="lg"
					font="sans"
					mobileSize="base"
				>
					{variant.description}
				</Body>
				<div className="mt-s flex flex-col gap-s">
					{variant.product?.options && (
						<OptionsSelect options={variant.product.options} />
					)}
					{variant.product && (
						<AddToCart variant="PDP" product={variant.product} />
					)}
				</div>
				<Addons addons={content?.addons} />
				<ProductSpecs specs={content?.specs} />
			</div>
		</ProductVariantsProvider>
	);
}
