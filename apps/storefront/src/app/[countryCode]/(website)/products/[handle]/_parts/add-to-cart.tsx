"use client";
import type { ButtonProps } from "@/components/shared/button";
import type { StoreProductVariant } from "@medusajs/types";

import { Cta } from "@/components/shared/button";
import { track } from "@vercel/analytics";
import { cx } from "cva";

import { useCart } from "@/components/global/header/cart/cart-context";
import { generateID } from "@/utils/generate";
import { useReplicache } from "@/zustand/replicache";
import { useProductVariants } from "../product-context";
import React from "react";
import { setCartId } from "@/actions/set-cart-id";

export default function AddToCart({
	region_id,
	variant,
}: {
	region_id: string;
	variant: "PDP" | "sticky";
}) {
	const { activeVariant } = useProductVariants();
	return (
		<AddToCartButton
			className={cx("", {
				"!h-[60px] w-fit": variant === "sticky",
				"w-full": variant === "PDP",
			})}
			label="Добавить в корзину"
			productVariant={activeVariant}
			regionId={region_id}
			size={variant === "PDP" ? "xl" : "md"}
			variant={variant === "PDP" ? "outline" : "primary"}
		/>
	);
}

type AddToCartButtonProps = {
	label: string;
	productVariant: StoreProductVariant | undefined;
	regionId: string;
} & Omit<ButtonProps, "onClick">;

export function AddToCartButton({
	label,
	productVariant,
	regionId,
	...buttonProps
}: AddToCartButtonProps) {
	const { cart } = useCart();
	const rep = useReplicache((state) => state.storeRep);
	const [isLoading, setIsLoading] = React.useState(false);
	const handleAddToCart = async () => {
		setIsLoading(true);

		if (!productVariant) return;

		if (cart) {
			const item = cart.items?.find(
				(item) => item.variant_id === productVariant.id,
			);
			if (item) {
				await rep?.mutate.updateLineItem({
					id: item.id,
					quantity: item.quantity + 1,
					cartId: cart.id,
				});
			}
		}
		const newId = generateID({ prefix: "line_item" });
		const newCartId = generateID({ prefix: "cart" });

		if (!cart) {
			setCartId(newCartId);
		}

		await rep?.mutate.createLineItem({
			lineItemInput: {
				cartId: cart?.id || newCartId,
				quantity: 1,
				variantId: productVariant.id,
				regionId,
				id: newId,
			},
			...(!cart && {
				newCartId,
			}),
		});

		track("add-to-cart", {
			quantity: 1,
			region_id: regionId,
			variantId: productVariant.id,
		});

		setIsLoading(false);
	};
	console.log("isLoading", isLoading);

	return (
		<Cta
			{...buttonProps}
			disabled={!productVariant || isLoading}
			loading={isLoading}
			onClick={(e) => {
				e.preventDefault();
				if (productVariant) {
					handleAddToCart();
				}
			}}
		>
			{label}
		</Cta>
	);
}
