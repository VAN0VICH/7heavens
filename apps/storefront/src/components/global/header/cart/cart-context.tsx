"use client";

import type { Dispatch, PropsWithChildren, SetStateAction } from "react";

import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useReplicache } from "@/zustand/replicache";
import { useGlobalStore } from "@/zustand/store";
import type { StoreCart, StoreLineItem } from "@blazzing-app/validators";
import { cartSubtotal } from "@/utils/business/cart-subtotal";

const CartContext = createContext<
	| {
			cart: StoreCart | null;
			lineItems: StoreLineItem[];
			subtotal: number;
			cartOpen: boolean;
			deleteItem: (id: string) => Promise<void>;
			updateItem: (id: string, quantity: number) => Promise<void>;
			setCartOpen: Dispatch<SetStateAction<boolean>>;
	  }
	| undefined
>(undefined);

export function CartProvider({
	cartID,
	children,
}: PropsWithChildren<{
	cartID: string | undefined;
	countryCode: string;
}>) {
	const [cartOpen, setCartOpen] = useState(false);

	const rep = useReplicache((state) => state.storeRep);
	const cartMap = useGlobalStore((state) => state.cartMap);
	const cart = cartMap.get(cartID ?? "");

	console.log("cart id ", cartID);
	console.log("cart", cart);
	const allLineItems = useGlobalStore((state) => state.lineItems);

	const lineItems = React.useMemo(
		() => allLineItems.filter((item) => item.cartID === cartID),
		[allLineItems, cartID],
	);

	const subtotal = React.useMemo(
		() => cartSubtotal(lineItems, cart as StoreCart),
		[lineItems, cart],
	);

	const deleteItem = React.useCallback(
		async (id: string) => {
			await rep?.mutate.deleteLineItem({ id });
		},
		[rep],
	);
	const updateItem = React.useCallback(
		async (id: string, quantity: number) => {
			await rep?.mutate.updateLineItem({ id, quantity });
		},
		[rep],
	);

	const pathname = usePathname();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setCartOpen(false);
	}, [pathname]);

	return (
		<CartContext.Provider
			value={{
				subtotal,
				cart: cart ?? null,
				cartOpen,
				lineItems,
				deleteItem,
				updateItem,
				setCartOpen,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export const useCart = () => {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};
