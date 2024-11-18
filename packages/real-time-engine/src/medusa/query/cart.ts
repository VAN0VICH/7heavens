import type { HttpTypes, StoreCart } from "@medusajs/types";

import { Effect } from "effect";
import { enrichLineItems } from "./line-items";
import { Cloudflare } from "../../context";
import { MedusaError } from "../../types/errors";

export const getCart = (cartId: string) =>
	Effect.gen(function* () {
		const { env } = yield* Cloudflare; // Assuming you're using a Cloudflare environment

		const url = new URL(`${env.MEDUSA_BACKEND_URL}/carts/${cartId}`);
		url.searchParams.append(
			"fields",
			"+items,+region,+items.product.*, +items.variant.image,+items.variant.*, +items.thumbnail,+items.metadata,+promotions.*",
		);

		return yield* Effect.tryPromise(() =>
			fetch(url.toString(), {
				headers: {
					"x-publishable-api-key": env.MEDUSA_PUBLISHABLE_KEY,
				},
			}).then(async (res) => {
				if (!res.ok) {
					console.error(`Error fetching cart: ${res.status} ${res.statusText}`);
					throw new Error("Error getting cart");
				}
				return res.json() as Promise<{ cart: StoreCart }>;
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: () =>
					new MedusaError({ message: "Error getting products" }),
			}),
		);
	});

export const getEnrichedCart = (cartId: string) =>
	Effect.gen(function* () {
		const cartData = yield* getCart(cartId);

		if (!cartData?.cart) {
			return null;
		}

		if (cartData.cart?.items?.length) {
			const enrichedItems = yield* enrichLineItems(
				cartData.cart?.items,
				cartData.cart?.region_id,
			);
			cartData.cart.items = enrichedItems as HttpTypes.StoreCartLineItem[];
		}

		return cartData.cart;
	});
