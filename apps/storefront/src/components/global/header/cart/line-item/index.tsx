"use client";

import Icon from "@/components/shared/icon";
import Body from "@/components/shared/typography/body";
import Image from "next/image";
import { PriceDetail } from "@/app/[countryCode]/(website)/products/[handle]/_parts/price";
import type { StoreLineItem } from "@blazzing-app/validators";
import React from "react";
import { useCart } from "../cart-context";
export function LineItem({ lineItem }: { lineItem: StoreLineItem }) {
	const { deleteItem, updateItem } = useCart();

	const reduceQuantity = React.useCallback(async () => {
		if (lineItem.quantity === 1) return await deleteItem?.(lineItem.id);
		await updateItem?.(lineItem.id, lineItem.quantity - 1);
	}, [lineItem, deleteItem, updateItem]);

	const increaseQuantity = React.useCallback(async () => {
		await updateItem?.(lineItem.id, lineItem.quantity + 1);
	}, [lineItem, updateItem]);

	if (!((lineItem.quantity || 0) > 0)) return null;

	return (
		<div className="flex items-start justify-between gap-2 space-x-4">
			<Image
				alt={lineItem.variant.title || "Product Image"}
				className="h-[100px] w-[100px] rounded-lg border-[1.5px] border-accent object-cover"
				height={100}
				src={lineItem.variant.thumbnail?.url ?? ""}
				width={100}
			/>
			<div className="flex w-full flex-col items-start justify-between h-full gap-4">
				<div className="flex w-full justify-between gap-3">
					<div>
						<Body className="leading-[130%]" font="sans" mobileSize="lg">
							{lineItem.title}
						</Body>
					</div>
					<Body className="font-semibold" font="sans" mobileSize="base">
						<PriceDetail variant={lineItem.variant} />
					</Body>
				</div>
				<div className="flex w-full items-center justify-between gap-4">
					<div className="flex h-10 w-32 items-center justify-center gap-1 overflow-hidden rounded-lg border border-accent">
						<button
							className="group flex h-full w-full flex-1 items-center justify-center hover:bg-secondary active:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
							type="button"
							onClick={reduceQuantity}
						>
							<span className="h-[1.5px] w-2 bg-accent transition-all duration-300 group-active:bg-background" />
						</button>
						<Body className="flex-1 text-center" font="sans" mobileSize="base">
							{lineItem.quantity}
						</Body>
						<button
							type="button"
							className="group relative flex h-full w-full flex-1 items-center justify-center hover:bg-secondary active:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
							onClick={increaseQuantity}
						>
							<span className="h-[1.5px] w-2 bg-accent transition-all duration-300 group-active:bg-background" />
							<span className="absolute left-1/2 top-1/2 h-2 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-accent transition-all duration-300 group-active:bg-background" />
						</button>
					</div>
					<button
						type="button"
						className="bg-transparent disabled:pointer-events-none disabled:opacity-50"
						onClick={() => deleteItem?.(lineItem.id)}
					>
						<Icon className="size-6" name="Trash" />
					</button>
				</div>
			</div>
		</div>
	);
}
