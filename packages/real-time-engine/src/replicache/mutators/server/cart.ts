import type { StoreCart } from "@medusajs/types";
import { Effect } from "effect";
import { Cloudflare, Database } from "../../../context";
import { schema } from "../../../db";
import {
	MedusaError,
	NeonDatabaseError,
	NotFound,
} from "../../../types/errors";
import { CreateCartSchema, UpdateCartSchema } from "../../../types/input/cart";
import { fn } from "../../utils/fn";

const createCart = fn(CreateCartSchema, (input) =>
	Effect.gen(function* () {
		const { cartId, regionId } = input;
		const { manager } = yield* Database;
		const { env } = yield* Cloudflare;

		if (!regionId) {
			return yield* Effect.fail(
				new NotFound({ message: "Region ID not found" }),
			);
		}

		const { cart } = yield* Effect.tryPromise(() =>
			fetch(`${env.MEDUSA_BACKEND_URL}/carts`, {
				method: "POST",
				headers: {
					"x-publishable-api-key": env.MEDUSA_PUBLISHABLE_KEY,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					region_id: regionId,
					metadata: {
						id: cartId,
					},
				}),
			}).then((res) => {
				if (!res.ok) {
					console.error(res.status);

					throw new Error("Error creating cart");
				}
				return res.json() as Promise<{ cart: StoreCart }>;
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: (e) =>
					new MedusaError({
						message: `Error creating cart ${JSON.stringify(e)}`,
					}),
			}),
		);
		yield* Effect.tryPromise(() =>
			manager
				.insert(schema.carts)
				.values({
					id: cartId,
					medusaId: cart.id,
				})
				.onConflictDoNothing(),
		).pipe(
			Effect.catchTags({
				UnknownException: () =>
					new NeonDatabaseError({ message: "Error inserting cart" }),
			}),
		);
		return cart.id;
	}),
);

const updateCart = fn(UpdateCartSchema, (input) =>
	Effect.gen(function* () {
		const { cartId, data } = input;
		const { manager } = yield* Database;
		const { env } = yield* Cloudflare;
		const cartData = yield* Effect.tryPromise(() =>
			manager.query.carts.findFirst({
				where: (cart, { eq }) => eq(cart.id, cartId),
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: () =>
					new NeonDatabaseError({
						message: "Error finding cart. Update cart.",
					}),
			}),
		);
		if (!cartData) {
			return yield* Effect.fail(new NotFound({ message: "Cart not found" }));
		}

		yield* Effect.tryPromise(() =>
			fetch(`${env.MEDUSA_BACKEND_URL}/carts/${cartId}`, {
				method: "POST",
				headers: {
					"x-publishable-api-key": env.MEDUSA_PUBLISHABLE_KEY,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}).then((res) => {
				if (!res.ok) {
					console.error(res.status);
					throw new Error("Error updating cart");
				}
				return res.json() as Promise<{ cart: StoreCart }>;
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: () =>
					new MedusaError({ message: "Error updating cart" }),
			}),
		);
	}),
);
export { createCart, updateCart };
