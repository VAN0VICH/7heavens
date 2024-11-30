import {
	PriceNotFound,
	type StoreLineItem,
	type StoreOrder,
} from "@blazzing-app/validators";

export function getDomainUrl(request: Request) {
	const host =
		request.headers.get("X-Forwarded-Host") ??
		request.headers.get("host") ??
		new URL(request.url).host;
	const protocol = host.includes("localhost") ? "http" : "https";
	return `${protocol}://${host}`;
}
export function getErrorMessage(error: unknown) {
	if (typeof error === "string") return error;
	if (
		error &&
		typeof error === "object" &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return error.message;
	}
	console.error("Unable to get error message for error", error);
	return "Unknown Error";
}

export function toImageURL(
	base64: string | undefined,
	fileType: string | undefined,
) {
	if (base64 === undefined || fileType === undefined) return undefined;
	return `data:${fileType};base64,${base64}`;
}

export function isMacOs() {
	if (typeof window === "undefined") return false;

	return window.navigator.userAgent.includes("Mac");
}
export const isTouchDevice = () => {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

export const capitalize = (str: string | undefined) =>
	str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export const decapitalize = (str: string | undefined) =>
	str ? str.charAt(0).toLowerCase() + str.slice(1) : "";

/**
 * Sort orders by prioritizing status ('completed' and 'cancelled' at the bottom),
 * and sorting by the freshest date within each group.
 *
 * @param {Array} orders - Array of order objects.
 * @param {string} statusKey - The key for the status property in the order object.
 * @param {string} dateKey - The key for the date property in the order object.
 * @returns {Array} - Sorted array of orders.
 */
export function sortOrders(orders: StoreOrder[]) {
	return orders.sort((a, b) => {
		// Determine priority based on status
		const statusA =
			a.status === "completed" || a.status === "cancelled" ? 1 : 0;
		const statusB =
			b.status === "completed" || b.status === "cancelled" ? 1 : 0;

		// Sort by status priority
		if (statusA !== statusB) {
			return statusA - statusB; // 'completed' and 'cancelled' come last
		}

		// Sort by date within the same group
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});
}
export const getLineItemPriceAmount = (
	lineItem: StoreLineItem,
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

export const orderSubtotal = (
	lineItems: StoreLineItem[],
	order: StoreOrder,
): number => {
	try {
		return lineItems.reduce((subtotal, item) => {
			const price = getLineItemPriceAmount(item, order.currencyCode);
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
