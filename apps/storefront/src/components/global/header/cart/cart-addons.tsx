import { AddonsItem } from "@/components/shared/addons-item";
import CarouselSection from "@/components/shared/carousel-section";
import Heading from "@/components/shared/typography/heading";
import { getProductsByHandles } from "@/data/blazzing-app/product-and-variant";

type Props = { handles: string[]; isEmptyCart: boolean };

export default async function CartAddons({ handles, isEmptyCart }: Props) {
	const products = await getProductsByHandles(handles);

	const slides = products.map((product) => (
		<div className="w-[380px]" key={product.id}>
			<AddonsItem variant="cart" product={product} />
		</div>
	));

	return (
		<div>
			<CarouselSection
				showButtons
				slides={slides}
				title={
					<Heading font="serif" mobileSize="lg" tag="h3">
						{isEmptyCart
							? "Вам может понравиться"
							: "Вам также может понравиться"}
					</Heading>
				}
				variant="cart"
			/>
		</div>
	);
}
