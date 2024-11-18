import type { StoreCart } from "@medusajs/types";
import type { ReadonlyJSONObject, WriteTransaction } from "replicache";
import type { CreateCart, UpdateCart } from "../../../types/input/cart";

async function createCart(tx: WriteTransaction, input: CreateCart) {
	const { cartId, regionId } = input;
	const region = (await tx.get(regionId)) as any;
	if (!region) {
		throw new Error("Region not found");
	}
	const newCart: StoreCart = {
		id: cartId,
		currency_code: "BYN",
		discount_tax_total: 0,
		discount_total: 0,
		gift_card_tax_total: 0,
		gift_card_total: 0,
		original_subtotal: 0,
		original_tax_total: 0,
		original_total: 0,
		region_id: regionId,
		shipping_tax_total: 0,
		shipping_total: 0,
		subtotal: 0,
		tax_total: 0,
		total: 0,
		metadata: {
			cartId,
		},
		item_subtotal: 0,
		item_tax_total: 0,
		item_total: 0,
		original_item_subtotal: 0,
		original_item_tax_total: 0,
		original_item_total: 0,
		original_shipping_subtotal: 0,
		original_shipping_tax_total: 0,
		original_shipping_total: 0,
		shipping_subtotal: 0,
		region,
	};

	await tx.set(cartId, newCart as any as ReadonlyJSONObject);
	console.log("done creating cart on the client.");
}

async function updateCart(tx: WriteTransaction, input: UpdateCart) {
	const { cartId, data } = input;

	const cart = (await tx.get(cartId)) as any as StoreCart;
	if (!cart) {
		throw new Error("Cart not found");
	}

	await tx.set(cartId, { ...(cart as any as ReadonlyJSONObject), ...data });
}

export { createCart, updateCart };
