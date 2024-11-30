import React, { useMemo } from "react";

const Price = ({
	amount,
	className,
	currencyCode = "BYN",
}: {
	amount: number;
	className?: string;
	currencyCode?: string;
} & React.ComponentProps<"p">) => {
	const formatter = useMemo(
		() =>
			new Intl.NumberFormat(undefined, {
				style: "currency",
				currency: currencyCode,
				currencyDisplay: "narrowSymbol",
			}),
		[currencyCode],
	);

	const formattedAmount = useMemo(
		() => formatter.format(amount / 100),
		[formatter, amount],
	);

	return (
		<p suppressHydrationWarning={true} className={className}>
			{formattedAmount}
		</p>
	);
};

export default React.memo(Price);
