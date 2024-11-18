import { Console, Effect } from "effect";

import type { StoreCart } from "@medusajs/types";
import { z } from "zod";
import { Cloudflare, Database } from "../../../context";
import { schema } from "../../../db";
import {
	MedusaError,
	NeonDatabaseError,
	NotFound,
} from "../../../types/errors";
import {
	CreateLineItemSchema,
	UpdateLineItemSchema,
} from "../../../types/input/line-item";
import { fn } from "../../utils/fn";
import { createCart } from "./cart";

const createLineItem = fn(CreateLineItemSchema, (input) =>
	Effect.gen(function* () {
		const { lineItemInput, newCartId } = input;
		const { manager } = yield* Database;
		const { env } = yield* Cloudflare;
		let createdMedusaCartId: string;

		if (newCartId) {
			const cartId = yield* createCart({
				cartId: newCartId,
				regionId: lineItemInput.regionId,
			});
			createdMedusaCartId = cartId as string;
		}
		const cartData = yield* Effect.tryPromise(() =>
			manager.query.carts.findFirst({
				where: (cart, { eq }) => eq(cart.id, lineItemInput.cartId),
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
			return yield* Effect.fail(
				new NotFound({ message: "Cart not found: Create line item" }),
			);
		}
		const body = {
			quantity: lineItemInput.quantity,
			variant_id: lineItemInput.variantId,
			metadata: {
				id: lineItemInput.id,
			},
		};

		const { cart } = yield* Effect.tryPromise(() =>
			fetch(
				`${env.MEDUSA_BACKEND_URL}/carts/${newCartId ? createdMedusaCartId : cartData.medusaId}/line-items`,
				{
					method: "POST",
					headers: {
						"x-publishable-api-key": env.MEDUSA_PUBLISHABLE_KEY,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(body),
				},
			).then((res) => {
				if (!res.ok) {
					console.error(res.status);
					throw new Error("Error creating line item");
				}
				return res.json() as Promise<{ cart: StoreCart }>;
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: () =>
					new MedusaError({ message: "Error creating line item" }),
			}),
		);
		const theItem = cart.items?.find(
			(item) => item.metadata?.id === lineItemInput.id,
		);
		if (!theItem) {
			return yield* Effect.fail(
				new MedusaError({ message: "Error creating line item:Item bot found" }),
			);
		}
		yield* Console.log("THE ITEM", theItem);
		yield* Effect.tryPromise(() =>
			manager
				.insert(schema.lineItems)
				.values({
					id: lineItemInput.id,
					medusaId: theItem.id,
				})
				.onConflictDoNothing()
				.catch((err) => {
					console.log("err", err);
					console.error("Database error:", err.message);
					console.error("Stack:", err.stack);
					throw err;
				}),
		).pipe(Effect.orDie);
	}),
);

const updateLineItem = fn(UpdateLineItemSchema, (input) =>
	Effect.gen(function* () {
		const { request, env } = yield* Cloudflare;

		const cartId = request.headers.get("x-cart-id");

		if (!cartId) return;

		const { quantity, id } = input;
		const { manager } = yield* Database;
		const itemData = yield* Effect.tryPromise(() =>
			manager.query.lineItems.findFirst({
				where: (items, { eq, or }) =>
					or(eq(items.id, id), eq(items.medusaId, id)),
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: () =>
					new NeonDatabaseError({ message: "Error finding line item" }),
			}),
		);

		if (!itemData) {
			return yield* Effect.fail(
				new NeonDatabaseError({ message: "Line item not found" }),
			);
		}
		yield* Effect.tryPromise(() =>
			fetch(
				`${env.MEDUSA_BACKEND_URL}/carts/${cartId}/line-items/${itemData.medusaId}`,
				{
					method: "POST",
					headers: {
						"x-publishable-api-key": env.MEDUSA_PUBLISHABLE_KEY,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						quantity,
					}),
				},
			).then((res) => {
				if (!res.ok) {
					console.error(res.status);
					throw new Error("Error updating line item");
				}
				return res.json() as Promise<{ cart: StoreCart }>;
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: () =>
					new MedusaError({ message: "Error updating line item" }),
			}),
		);
	}),
);
const deleteLineItem = fn(
	z.object({ id: z.string(), cartId: z.string() }),
	(input) =>
		Effect.gen(function* () {
			const { id } = input;
			const { request, env } = yield* Cloudflare;
			const { manager } = yield* Database;
			const cartId = request.headers.get("x-cart-id");
			if (!cartId) return;
			const itemData = yield* Effect.tryPromise(() =>
				manager.query.lineItems.findFirst({
					where: (items, { eq, or }) =>
						or(eq(items.id, id), eq(items.medusaId, id)),
				}),
			).pipe(
				Effect.catchTags({
					UnknownException: () =>
						new NeonDatabaseError({ message: "Error finding line item" }),
				}),
			);

			if (!itemData) {
				return yield* Effect.fail(
					new NeonDatabaseError({ message: "Line item not found" }),
				);
			}
			yield* Effect.tryPromise(() =>
				fetch(
					`${env.MEDUSA_BACKEND_URL}/carts/${cartId}/line-items/${itemData.medusaId}`,
					{
						method: "DELETE",
						headers: {
							"x-publishable-api-key": env.MEDUSA_PUBLISHABLE_KEY,
							"Content-Type": "application/json",
						},
					},
				).then((res) => {
					if (!res.ok) {
						console.error(res.status);
						throw new Error("Error deleting line item");
					}
					return res.json() as Promise<{ cart: StoreCart }>;
				}),
			).pipe(
				Effect.catchTags({
					UnknownException: () =>
						new MedusaError({ message: "Error deleting line item" }),
				}),
			);
		}),
);
export { createLineItem, deleteLineItem, updateLineItem };
