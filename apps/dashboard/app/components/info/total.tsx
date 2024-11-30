import type { StoreLineItem, StoreOrder } from "@blazzing-app/validators";
import { Box, Flex, Separator, Text } from "@radix-ui/themes";
import React from "react";
import Price from "../price";
import { cn } from "~/ui";

export const Total = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		order: StoreOrder;
		lineItems: StoreLineItem[];
	}
>(({ className, order, lineItems, ...props }, ref) => {
	const subtotal = order.total;
	return (
		<Box ref={ref} className={cn("w-full", className)} {...props}>
			<Flex justify="between">
				<Text weight="medium">Итого:</Text>

				<Price amount={subtotal} currencyCode={order.currencyCode ?? "BYN"} />
			</Flex>

			<Flex justify="between">
				<Text weight="medium">Доставка:</Text>

				<Price amount={0} currencyCode={order.currencyCode ?? "BYN"} />
			</Flex>

			<Flex justify="between">
				<Text weight="medium">Налог:</Text>
				<Price amount={0} currencyCode={order.currencyCode ?? "BYN"} />
			</Flex>
			<Separator className="my-4 w-full bg-accent-7" />

			<Flex justify="between">
				<Text weight="bold" size="5">
					Всего:
				</Text>
				<Text weight="bold" size="5">
					<Price amount={subtotal} currencyCode={order.currencyCode ?? "BYN"} />
				</Text>
			</Flex>
		</Box>
	);
});
