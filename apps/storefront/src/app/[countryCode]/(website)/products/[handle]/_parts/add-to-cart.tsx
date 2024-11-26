"use client";
import type { ButtonProps } from "@/components/shared/button";

import { Cta } from "@/components/shared/button";
import { cx } from "cva";

import { setCartId } from "@/actions/set-cart-id";
import { generateID } from "@/utils/generate";
import { useReplicache } from "@/zustand/replicache";
import { useGlobalStore } from "@/zustand/store";
import type { StoreProduct, StoreVariant } from "@blazzing-app/validators";
import { useProductVariants } from "../product-context";
import React from "react";

export default function AddToCart({
	variant,
	product,
	cartID,
}: {
	variant: "PDP" | "sticky";
	product: StoreProduct;
	cartID: string | undefined;
}) {
	const { selectedVariant, setIsShaking } = useProductVariants();
	console.log("product variants", product.variants);
	return (
		<AddToCartButton
			className={cx("", {
				"!h-[60px] w-fit": variant === "sticky",
				"w-full": variant === "PDP",
			})}
			label="Добавить в корзину"
			selectedVariant={selectedVariant}
			baseVariantID={product.baseVariantID}
			variants={product.variants ?? []}
			size={variant === "PDP" ? "xl" : "md"}
			variant={variant === "PDP" ? "outline" : "primary"}
			cartID={cartID}
			setIsShaking={setIsShaking}
		/>
	);
}

type AddToCartButtonProps = {
	label: string;
	selectedVariant: StoreVariant | undefined;
	variants: StoreVariant[];
	baseVariantID: string;
	cartID: string | undefined;
	setIsShaking?: React.Dispatch<React.SetStateAction<boolean>>;
} & Omit<ButtonProps, "onClick">;

export function AddToCartButton({
	label,
	selectedVariant,
	baseVariantID,
	variants,
	cartID,
	setIsShaking,
	...buttonProps
}: AddToCartButtonProps) {
	const rep = useReplicache((state) => state.storeRep);
	const items = useGlobalStore((state) => state.lineItems);

	const itemsIDs = React.useMemo(
		() => new Map(items.map((i) => [i.variantID, i])),
		[items],
	);
	const handleAddToCart = React.useCallback(async () => {
		if (
			!selectedVariant ||
			(variants.length > 1 && !selectedVariant) ||
			(variants.length > 1 && selectedVariant.id === baseVariantID)
		) {
			setIsShaking?.(true);
			setIsShaking && setTimeout(setIsShaking, 250);

			return;
		}

		const item = itemsIDs.get(selectedVariant.id);
		if (item) {
			await rep?.mutate.updateLineItem({
				id: item.id,
				quantity: item.quantity + 1,
			});
			return;
		}
		const newID = generateID({ prefix: "line_item" });
		const newCartID = generateID({ prefix: "cart" });

		if (!cartID) {
			await setCartId(newCartID);
		}

		selectedVariant.product &&
			(await rep?.mutate.createLineItem({
				lineItem: {
					id: newID,
					cartID: cartID ?? newCartID,
					title: selectedVariant.title ?? "",
					quantity: 1,
					createdAt: new Date().toISOString(),
					variant: selectedVariant,
					variantID: selectedVariant.id,
					productID: selectedVariant.productID,
					product: selectedVariant.product,
					storeID: selectedVariant.product.storeID ?? "",
				},
				...(!cartID && {
					newCartID,
				}),
			}));
	}, [
		variants,
		baseVariantID,
		cartID,
		itemsIDs,
		rep,
		selectedVariant,
		setIsShaking,
	]);

	return (
		<Cta
			{...buttonProps}
			disabled={!selectedVariant}
			onClick={async (e) => {
				e.preventDefault();
				await handleAddToCart();
			}}
		>
			{label}
		</Cta>
	);
}
