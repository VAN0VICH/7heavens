import { Effect } from "effect";
import { MedusaError } from "../../../../types/errors";
import type { Row } from "../../../../types/replicache";
import type { GetRows } from "../types";
import { Cloudflare, Database } from "../../../../context";
import type { StoreProduct } from "@medusajs/types";

export const productsCVD: GetRows = () =>
	Effect.gen(function* (_) {
		const { manager } = yield* Database;
		const { env } = yield* Cloudflare;

		const productData = yield* Effect.tryPromise(() =>
			manager.query.products.findMany(),
		).pipe(
			Effect.catchTags({
				UnknownException: () =>
					new MedusaError({ message: "Error getting products" }),
			}),
		);

		const productAvailableMap = new Map<string, boolean>();
		yield* Effect.forEach(
			productData,
			(product) =>
				Effect.sync(() => {
					productAvailableMap.set(product.id, product.available ?? true);
				}),
			{ concurrency: "unbounded" },
		);

		const { products } = yield* Effect.tryPromise(() =>
			fetch(`${env.MEDUSA_BACKEND_URL}/products`, {
				headers: {
					"x-publishable-api-key": env.MEDUSA_PUBLISHABLE_KEY,
				},
			}).then((res) => {
				if (!res.ok) {
					console.error(res.status);
					throw new Error("Error getting products");
				}
				return res.json() as Promise<{ products: StoreProduct[] }>;
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: () =>
					new MedusaError({ message: "Error getting products" }),
			}),
		);

		const result: Row[] = [];

		yield* Effect.sync(() => {
			for (const product of products) {
				result.push({
					...product,
					available:
						productAvailableMap.get(product.id) === undefined
							? true
							: productAvailableMap.get(product.id),
				});
				for (const variant of product.variants ?? []) {
					result.push(variant as any as Row);
				}
			}
		});

		return yield* Effect.succeed(result);
	});
