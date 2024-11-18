import { Console, Effect } from "effect";
import { Cloudflare, Database } from "../../../../context";
import { getEnrichedCart } from "../../../../medusa/query/cart";
import { MedusaError } from "../../../../types/errors";
import type { Row } from "../../../../types/replicache";
import type { GetRows } from "../types";
import { createCart } from "../../../mutators/server/cart";
import { generateID } from "../../../utils/generate";
import type { StoreRegion } from "@medusajs/types";

export const cartCVD: GetRows = () =>
	Effect.gen(function* () {
		const { request, env } = yield* Cloudflare;
		const { manager } = yield* Database;
		let cartId = request.headers.get("x-cart-id");

		if (!cartId) {
			cartId = generateID({ prefix: "cart" });
			const { regions } = yield* Effect.tryPromise(() => {
				const queryParams = new URLSearchParams({
					fields: "*countries", // Fixed fields parameter
				});
				return fetch(
					`${env.MEDUSA_BACKEND_URL}/regions?${queryParams.toString()}`,
					{
						headers: {
							"x-publishable-api-key": env.MEDUSA_PUBLISHABLE_KEY,
						},
					},
				).then((res) => {
					if (!res.ok) {
						console.error(res.status);
						throw new Error("Error getting regions");
					}
					return res.json() as Promise<{ regions: StoreRegion[] }>;
				});
			}).pipe(Effect.orDie);
			if (!regions || regions.length === 0) {
				yield* Console.error("no region found");
				return [];
			}
			yield* Console.log("no cart id found");
			yield* createCart({
				cartId,
				regionId: regions[0]!.id,
			});
		}

		const cartData = yield* Effect.tryPromise(() =>
			manager.query.carts.findFirst({
				where: (carts, { eq }) => eq(carts.id, cartId!),
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: () =>
					new MedusaError({ message: "Error getting cart CVD" }),
			}),
		);
		if (!cartData) {
			yield* Console.log("no cart data found");
			return [];
		}
		const cart = yield* getEnrichedCart(cartData.medusaId);

		if (!cart?.metadata?.id) return [];
		return [
			{
				...cart,
				id: cartId,
			} as any as Row,
		];
	});
