import type { StoreCartLineItem } from "@medusajs/types";

function calculateCartTotal(cartItems: StoreCartLineItem[]) {
	return (
		cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0) ||
		0
	);
}
export { calculateCartTotal };
