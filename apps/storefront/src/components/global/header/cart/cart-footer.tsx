"use client";

import { Link } from "@/components/shared/button";
import Body from "@/components/shared/typography/body";

import Price from "@/components/price";
import { useCart } from "./cart-context";

export default function CartFooter() {
	const { cart, lineItems, subtotal } = useCart();

	const cartIsEmpty = lineItems.length === 0;

	if (cartIsEmpty) return null;

	return (
		<>
			<div className="h-px w-full bg-accent" />
			<div className="flex w-full flex-col justify-between gap-4 p-s">
				<div className="flex w-full justify-between gap-4">
					<div>
						<Body
							className="font-semibold"
							desktopSize="xl"
							font="sans"
							mobileSize="base"
						>
							Заказ
						</Body>
					</div>
					{subtotal && (
						<Body font="sans" mobileSize="base" desktopSize="xl">
							<Price amount={subtotal} currencyCode={cart?.currencyCode} />
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
