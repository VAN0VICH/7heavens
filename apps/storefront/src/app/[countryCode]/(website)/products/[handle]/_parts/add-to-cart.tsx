"use client";
import type { ButtonProps } from "@/components/shared/button";

import { Cta } from "@/components/shared/button";
import { cx } from "cva";

import { setCartId } from "@/actions/set-cart-id";
import { useReplicache } from "@/zustand/replicache";
import { useGlobalStore } from "@/zustand/store";
import type { StoreProduct, StoreVariant } from "@blazzing-app/validators";
import { useProductVariants } from "../product-context";
import React from "react";
import { useCart } from "@/components/global/header/cart/cart-context";
import { generateID } from "@blazzing-app/utils";
import { setTempUserID } from "@/actions/set-temp-user-id";

export default function AddToCart({
	variant,
	product,
	cartID,
	tempUserID,
}: {
	variant: "PDP" | "sticky";
	product: StoreProduct;
	cartID: string | undefined;
	tempUserID: string | undefined;
}) {
	const { selectedVariant, setIsShaking } = useProductVariants();
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
			tempUserID={tempUserID}
		/>
	);
}

type AddToCartButtonProps = {
	label: string;
	selectedVariant: StoreVariant | undefined;
	variants: StoreVariant[];
	baseVariantID: string;
	cartID: string | undefined;
	tempUserID: string | undefined;
	setIsShaking?: React.Dispatch<React.SetStateAction<boolean>>;
} & Omit<ButtonProps, "onClick">;

export function AddToCartButton({
	label,
	selectedVariant,
	baseVariantID,
	variants,
	cartID,
	tempUserID,
	setIsShaking,
	...buttonProps
}: AddToCartButtonProps) {
	const [isLoading, setIsLoading] = React.useState(false);
	const rep = useReplicache((state) => state.storeRep);
	const items = useGlobalStore((state) => state.lineItems);
	const productsMap = useGlobalStore((state) => state.productsMap);
	const product = productsMap.get(selectedVariant?.productID ?? "");
	const available = product?.available === undefined ? true : product.available;
	const { setCartOpen } = useCart();

	const itemsIDs = React.useMemo(
		() => new Map(items.map((i) => [i.variantID, i])),
		[items],
	);
	const handleAddToCart = React.useCallback(async () => {
		if (!available) return;
		if (
			!selectedVariant ||
			(variants.length > 1 && !selectedVariant) ||
			(variants.length > 1 && selectedVariant.id === baseVariantID)
		) {
			setIsShaking?.(true);
			setIsShaking && setTimeout(setIsShaking, 250);

			return;
		}
		setIsLoading(true);

		const item = itemsIDs.get(selectedVariant.id);
		if (item) {
			await rep?.mutate.updateLineItem({
				id: item.id,
				quantity: item.quantity + 1,
			});
			setCartOpen(true);
			setIsLoading(false);
			return;
		}
		const newID = generateID({ prefix: "line_item" });
		const newCartID = generateID({ prefix: "cart" });

		if (!cartID) {
			await setCartId(newCartID);
		}
		if (!tempUserID) {
			await setTempUserID(generateID({ prefix: "user" }));
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
		setCartOpen(true);
		setIsLoading(false);
	}, [
		variants,
		baseVariantID,
		cartID,
		itemsIDs,
		rep,
		selectedVariant,
		setIsShaking,
		setCartOpen,
		tempUserID,
		available,
	]);

	return (
		<Cta
			{...buttonProps}
			disabled={!selectedVariant || !available}
			loading={isLoading}
			onClick={async (e) => {
				e.preventDefault();
				await handleAddToCart();
			}}
		>
			{!available
				? "Временно не доступен"
				: !selectedVariant
					? "Выберите опцию"
					: label}
		</Cta>
	);
}
