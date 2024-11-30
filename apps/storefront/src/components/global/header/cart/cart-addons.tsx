import { AddonsItem } from "@/components/shared/addons-item";
import CarouselSection from "@/components/shared/carousel-section";
import Heading from "@/components/shared/typography/heading";
import { useGlobalStore } from "@/zustand/store";
import React from "react";
type Props = {
	handles: string[];
	isEmptyCart: boolean;
	cartID: string | undefined;
	tempUserID: string | undefined;
};

export function CartAddons({
	handles,
	isEmptyCart,
	cartID,
	tempUserID,
}: Props) {
	const products_ = useGlobalStore((state) => state.products);
	const products = React.useMemo(
		() => products_.filter((p) => handles.includes(p.collectionHandle ?? "")),
		[products_, handles],
	);
	// const cartID = await getCartId();

	const slides = products.map((product) => (
		<div className="w-[380px]" key={product.id}>
			<AddonsItem
				variant="cart"
				product={product}
				cartID={cartID}
				tempUserID={tempUserID}
			/>
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
