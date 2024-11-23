"use client";

import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import { convertToLocale } from "@/utils/business/money";

import { useCart } from "@/components/global/header/cart/cart-context";
import type {
	Cart,
	LineItem as LineItemType,
} from "@blazzing-app/validators/client";
import React from "react";
import { LineItem } from "@/components/global/header/cart/line-item";

export function CartDetails() {
	const { lineItems, cart, subtotal } = useCart();
	return (
		<div className="flex h-fit w-full flex-col gap-4 rounded-lg border border-accent p-4 md:max-w-[420px]">
			<Heading desktopSize="xl" font="serif" mobileSize="lg" tag="h3">
				Заказ
			</Heading>
			{lineItems?.map((item) => (
				<LineItem key={item.id} lineItem={item} />
			))}
			<div className="h-px w-full bg-accent" />
			{cart && (
				<CheckoutSummary
					cart={cart}
					lineItems={lineItems}
					subtotal={subtotal}
				/>
			)}
		</div>
	);
}

export function CheckoutSummary({
	cart,
	lineItems,
	subtotal,
}: { cart: Cart; lineItems: LineItemType[]; subtotal: number }) {
	const summaryItems = [
		{ amount: subtotal, label: "Цена" },
		// { amount: cart.tax_total, label: "Налоги" },
		// { amount: cart.shipping_total, label: "Доставка" },
	];

	return (
		<>
			{summaryItems.map((item) => (
				<CheckoutSummaryItem
					amount={item.amount}
					currencyCode={cart.currencyCode}
					key={item.label}
					label={item.label}
				/>
			))}
			<CheckoutTotal
				amount={subtotal}
				label="Total"
				currencyCode={cart.currencyCode}
			/>
		</>
	);
}

export function CheckoutSummaryItem({
	amount,
	currencyCode,
	label,
}: {
	amount: number;
	currencyCode: string;
	label: string;
}) {
	const display = convertToLocale({
		amount,
		currencyCode,
	});

	return (
		<>
			<div className="flex items-center justify-between">
				<Body font="sans" mobileSize="lg">
					{label}
				</Body>

				<Body font="sans" mobileSize="lg">
					{display}
				</Body>
			</div>
		</>
	);
}

export function CheckoutTotal({
	amount,
	currencyCode,
	label,
}: {
	amount: number;
	currencyCode: string;
	label: string;
}) {
	const display = convertToLocale({
		amount,
		currencyCode,
	});

	return (
		<>
			<div className="h-px w-full bg-accent" />
			<div className="flex items-center justify-between">
				<Heading desktopSize="base" font="sans" mobileSize="base" tag="h3">
					{label}
				</Heading>

				<Heading desktopSize="base" font="sans" mobileSize="base" tag="h3">
					{display}
				</Heading>
			</div>
		</>
	);
}
