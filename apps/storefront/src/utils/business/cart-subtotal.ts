import { PriceNotFound } from "@blazzing-app/validators";
import type { Cart, LineItem, Order } from "@blazzing-app/validators/client";

export const getLineItemPriceAmount = (
	lineItem: LineItem,
	currencyCode: string,
): number => {
	const price = lineItem.variant.prices.find(
		(p) => p.currencyCode === currencyCode,
	);
	if (!price) {
		throw new PriceNotFound({
			message: `Price for "${lineItem.variant.title}" with the currency code "${currencyCode}" not found. Please remove it from the cart.`,
		});
	}
	return price.amount;
};

export const cartSubtotal = (
	lineItems: LineItem[],
	cartOrOrder: Cart | Order,
): number => {
	try {
		return lineItems.reduce((subtotal, item) => {
			const price = getLineItemPriceAmount(item, cartOrOrder.currencyCode);
			return subtotal + item.quantity * price;
		}, 0);
	} catch (error) {
		if (error instanceof PriceNotFound) {
			throw error; // Re-throw specific errors to handle them elsewhere
		}
		throw new Error(
			"An unknown error occurred while calculating the cart subtotal.",
		);
	}
};
