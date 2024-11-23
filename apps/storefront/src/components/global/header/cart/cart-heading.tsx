"use client";

import Heading from "@/components/shared/typography/heading";
import { Title } from "@radix-ui/react-dialog";

import { useCart } from "./cart-context";

export default function CartHeading() {
	const { lineItems } = useCart();

	const count = (lineItems?.length ?? 0).toString();

	return (
		<div className="flex min-h-[calc(var(--header-height))] items-center justify-start px-4">
			<Title asChild>
				<Heading desktopSize="2xl" font="serif" mobileSize="lg" tag="h2">
					Моя корзина ({count})
				</Heading>
			</Title>
		</div>
	);
}
