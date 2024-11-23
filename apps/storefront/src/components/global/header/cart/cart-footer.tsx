"use client";

import { Link } from "@/components/shared/button";
import Body from "@/components/shared/typography/body";
import { convertToLocale } from "@/utils/business/money";

import { useCart } from "./cart-context";

export default function CartFooter() {
	const { cart, lineItems, subtotal } = useCart();

	const total = cart
		? convertToLocale({
				amount: subtotal,
				currencyCode: cart.currencyCode,
			})
		: null;

	const cartIsEmpty = lineItems.length === 0;

	if (cartIsEmpty) return null;

	return (
		<>
			<div className="h-px w-full bg-accent" />
			<div className="flex w-full flex-col justify-between gap-4 p-s">
				<div className="flex w-full justify-between gap-4">
					<div>
						<Body className="font-semibold" font="sans" mobileSize="base">
							Заказ
						</Body>
					</div>
					{total && (
						<Body font="sans" mobileSize="base">
							{total}
						</Body>
					)}
				</div>
				{!cartIsEmpty && (
					<Link className="w-full" href="/checkout" size="lg" variant="primary">
						Оформить заказ
					</Link>
				)}
			</div>
		</>
	);
}
