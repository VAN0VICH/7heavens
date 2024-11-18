"use client";

import Icon from "@/components/shared/icon";
import {
	CloseDialog,
	Dialog,
	SideDialog,
} from "@/components/shared/side-dialog";
import Body from "@/components/shared/typography/body";

import { useCart } from "./cart-context";
import CartFooter from "./cart-footer";
import CartHeading from "./cart-heading";
import LineItem from "./line-item";
import OpenCart from "./open-cart-button";
import { useReplicache } from "@/zustand/replicache";
import React from "react";

export default function CartUI({
	addons,
}: { addons: React.ReactElement | null }) {
	const { cart } = useCart();
	const isEmptyCart = !cart?.items || cart.items.length === 0;
	const rep = useReplicache((state) => state.storeRep);

	const deleteItem = React.useCallback(
		async (id: string) => {
			cart && (await rep?.mutate.deleteLineItem({ id, cartId: cart.id }));
		},
		[rep, cart],
	);
	const updateItem = React.useCallback(
		async (id: string, quantity: number) => {
			cart &&
				(await rep?.mutate.updateLineItem({ id, quantity, cartId: cart.id }));
		},
		[rep, cart],
	);

	return (
		<Dialog>
			<OpenCart />
			<SideDialog>
				<div className="relative flex h-full w-full flex-col border-l border-accent bg-background">
					<CartHeading />
					<div className="h-px w-full bg-accent" />
					<CloseDialog
						aria-label="Close"
						className="absolute right-[10px] top-[10px]"
					>
						<Icon className="h-9 w-9" name="Close" />
					</CloseDialog>
					<div className="flex flex-1 flex-col justify-between overflow-y-scroll">
						<div className="flex flex-col gap-4 p-4">
							{isEmptyCart ? (
								<Body font="sans" mobileSize="base">
									Корзина пустая.
								</Body>
							) : (
								cart.items?.map((item) => (
									<LineItem
										key={item.id}
										props={item}
										deleteItem={deleteItem}
										updateItem={updateItem}
									/>
								))
							)}
						</div>
						{addons}
					</div>
					{!isEmptyCart && <CartFooter />}
				</div>
			</SideDialog>
		</Dialog>
	);
}
