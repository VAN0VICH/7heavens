"use client";

import Body from "@/components/shared/typography/body";

import Price from "@/components/price";
import type { Variant } from "@blazzing-app/validators/client";

export function PriceDetail({
	variant,
}: {
	variant: Variant | undefined;
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
