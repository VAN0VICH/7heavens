import type { ReadonlyJSONObject, WriteTransaction } from "replicache";

import type {
	StoreCart,
	StoreCartLineItem,
	StoreProduct,
	StoreProductVariant,
} from "@medusajs/types";
import type {
	CreateLineItem,
	UpdateLineItem,
} from "../../../types/input/line-item";
import { createCart } from "./cart";
import { calculateCartTotal } from "../../../lib/calculate";

async function createLineItem(tx: WriteTransaction, input: CreateLineItem) {
	const { lineItemInput, newCartId } = input;
	if (newCartId) {
		await createCart(tx, {
			cartId: newCartId,
			regionId: lineItemInput.regionId,
		});
	}
	const variant = (await tx.get(lineItemInput.variantId)) as any as
		| StoreProductVariant
		| undefined;

	if (!variant) {
		console.info("Variant not found");
		throw new Error("Variant not found");
	}

	if (!variant.product_id) {
		console.info("Product not found");
		throw new Error("Product not found");
	}

	const product = (await tx.get(variant.product_id)) as any as
		| StoreProduct
		| undefined;

	if (!product) {
		console.info("Product not found");
		throw new Error("Product not found");
	}

	const cart = (await tx.get(
		newCartId || lineItemInput.cartId,
	)) as any as StoreCart;

	if (!cart) {
		console.info("Cart not found");
		throw new Error("Cart not found");
	}

	const priceAmount = variant.calculated_price?.calculated_amount || 0;

	const newItem: StoreCartLineItem = {
		cart: cart,
		cart_id: lineItemInput.cartId,
		discount_tax_total: 0,
		discount_total: 0,
		id: lineItemInput.id,
		is_discountable: false,
		is_tax_inclusive: false,
		item_subtotal: priceAmount,
		item_tax_total: 0,
		item_total: priceAmount,
		original_subtotal: priceAmount,
		original_tax_total: 0,
		original_total: priceAmount,
		product: product || undefined,
		quantity: 1,
		requires_shipping: true,
		subtotal: priceAmount,
		tax_total: 0,
		title: variant.title || "",
		total: priceAmount,
		unit_price: priceAmount,
		variant,
	};
	const newItems = [...(cart.items || []), newItem];
	const newTotal = calculateCartTotal(newItems);

	await tx.set(cart.id, {
		...(cart as any as ReadonlyJSONObject),
		item_total: newTotal,
		items: newItems as any as ReadonlyJSONObject[],
	});
}

async function updateLineItem(tx: WriteTransaction, input: UpdateLineItem) {
	const { id, quantity, cartId } = input;

	const cart = (await tx.get(cartId)) as any as StoreCart;
	if (!cart) {
		console.info("Cart not found");
		throw new Error("Cart not found");
	}

	const newItems = cart.items?.map((item) => {
		if (item.id === id) {
			return {
				...item,
				quantity,
			};
		}

		return item;
	});
	const newTotal = calculateCartTotal(newItems ?? []);

	await tx.set(cart.id, {
		...(cart as any as ReadonlyJSONObject),
		items: newItems as any as ReadonlyJSONObject[],
		item_total: newTotal,
	});
}

async function deleteLineItem(
	tx: WriteTransaction,
	input: { id: string; cartId: string },
) {
	const { id, cartId } = input;
	const cart = (await tx.get(cartId)) as any as StoreCart;
	if (!cart) {
		console.info("Cart not found");
		throw new Error("Cart not found");
	}

	await tx.set(cart.id, {
		...(cart as any as ReadonlyJSONObject),
		items: (cart.items as any as ReadonlyJSONObject[]).filter(
			(item) => item.id !== id,
		),
	});
}

export { createLineItem, deleteLineItem, updateLineItem };
