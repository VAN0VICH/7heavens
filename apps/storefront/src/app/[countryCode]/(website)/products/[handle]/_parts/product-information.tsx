import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";

import type { PRODUCT_QUERYResult } from "@/types/sanity.generated";
import type { StoreProduct, StoreVariant } from "@blazzing-app/validators";
import { ProductVariantsProvider } from "../product-context";
import AddToCart from "./add-to-cart";
import { Addons } from "./addons";
import OptionsSelect from "./options";
import { PriceDetail } from "./price";
import ProductSpecs from "./specs";

type Props = {
	content: PRODUCT_QUERYResult;
	variant: StoreVariant;
	product: StoreProduct;
	handle: string;
	cartID: string | undefined;
	tempUserID: string | undefined;
};

export function ProductInformation({
	content,
	variant,
	product,
	handle,
	cartID,
	tempUserID,
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
					<OptionsSelect options={product.options} />
					<AddToCart
						variant="PDP"
						product={product}
						cartID={cartID}
						tempUserID={tempUserID}
					/>
				</div>
				<Addons addons={content?.addons} />
				<ProductSpecs specs={content?.specs} />
			</div>
		</ProductVariantsProvider>
	);
}
