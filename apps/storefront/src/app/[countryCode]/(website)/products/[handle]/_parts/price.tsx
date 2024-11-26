"use client";

import Body from "@/components/shared/typography/body";

import Price from "@/components/price";
import type { StoreVariant } from "@blazzing-app/validators";

export function PriceDetail({
	variant,
}: {
	variant: StoreVariant | undefined;
}) {
	if (!variant?.prices?.[0]) return null;
	return (
		<Body desktopSize="xl" font="sans" mobileSize="lg">
			<Price
				amount={variant.prices[0].amount ?? 0}
				currencyCode={variant?.prices?.[0]?.currencyCode ?? "BYN"}
			/>
		</Body>
	);
}
