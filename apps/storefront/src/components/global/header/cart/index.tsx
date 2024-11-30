"use client";
import type { Header } from "@/types/sanity.generated";

import { CartAddons } from "./cart-addons";
import { useCart } from "./cart-context";
import CartUI from "./cart-ui";

type Props = Pick<Header, "cartAddons"> & {
	cartID: string | undefined;
	tempUserID: string | undefined;
};

export function Cart({ cartAddons, cartID, tempUserID }: Props) {
	const { lineItems } = useCart();

	const addonHandles = (
		cartAddons?.map(({ handle }) => handle).filter(Boolean) || []
	).filter(
		(handle) => !lineItems?.some(({ variant }) => variant?.handle === handle),
	) as string[];

	const isEmptyCart = !lineItems || lineItems.length === 0;
	const addons =
		addonHandles.length > 0 ? (
			<CartAddons
				handles={addonHandles}
				isEmptyCart={isEmptyCart}
				cartID={cartID}
				tempUserID={tempUserID}
			/>
		) : null;

	return <CartUI addons={addons} />;
}
