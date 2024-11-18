"use client";

import type { StoreCart, StorePromotion } from "@medusajs/types";
import type { Dispatch, SetStateAction } from "react";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { useGlobalStore } from "@/zustand/store";

type Cart =
	| ({
			promotions?: StorePromotion[];
	  } & StoreCart)
	| undefined;

const CartContext = createContext<
	| {
			cart: Cart | null;
			cartOpen: boolean;
			setCartOpen: Dispatch<SetStateAction<boolean>>;
	  }
	| undefined
>(undefined);

export function CartProvider({
	children,
	cartId,
}: { children: React.ReactNode; cartId: string | undefined }) {
	const cartMap = useGlobalStore((state) => state.cartMap);
	const cart = cartId ? cartMap.get(cartId) : undefined;
	const [cartOpen, setCartOpen] = useState(false);

	const pathname = usePathname();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setCartOpen(false);
	}, [pathname]);

	return (
		<CartContext.Provider
			value={{
				cart,
				cartOpen,
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
