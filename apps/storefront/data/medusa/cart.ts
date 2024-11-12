import type { HttpTypes } from "@medusajs/types";

import client from "./client";
import { getAuthHeaders, getCartId } from "./cookies";
import { enrichLineItems } from "./line-items";

export const getCart = async () => {
	"use cache";
	const cartId = await getCartId();

	if (!cartId) {
		return null;
	}

	return await client.store.cart
		.retrieve(
			cartId,
			{
				fields:
					"+items, +region, +items.product.*, +items.variant.image, +items.variant.*, +items.thumbnail, +items.metadata, +promotions.*,",
			},
			{ next: { tags: ["cart"] }, ...(await getAuthHeaders()) },
		)
		.then(
			({ cart }) =>
				cart as {
					promotions?: HttpTypes.StorePromotion[];
				} & HttpTypes.StoreCart,
		)
		.catch(() => {
			return null;
		});
};

export const getEnrichedCart = async () => {
	"use cache";
	const cart = await getCart();

	if (!cart) {
		return null;
	}

	if (cart?.items?.length) {
		const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id);
		cart.items = enrichedItems as HttpTypes.StoreCartLineItem[];
	}

	return cart;
};
