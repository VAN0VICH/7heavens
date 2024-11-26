"use client";
import type { Header } from "@/types/sanity.generated";

import { Suspense } from "react";

import CartAddons from "./cart-addons";
import { useCart } from "./cart-context";
import CartUI from "./cart-ui";

type Props = Pick<Header, "cartAddons">;

export function Cart({ cartAddons }: Props) {
	const { lineItems } = useCart();

	const addonHandles = (
		cartAddons?.map(({ handle }) => handle).filter(Boolean) || []
	).filter(
		(handle) => !lineItems?.some(({ variant }) => variant?.handle === handle),
	) as string[];

	const isEmptyCart = !lineItems || lineItems.length === 0;
	const addons =
		addonHandles.length > 0 ? (
			<Suspense>
				<CartAddons handles={addonHandles} isEmptyCart={isEmptyCart} />
			</Suspense>
		) : null;

	return <CartUI addons={addons} />;
}
