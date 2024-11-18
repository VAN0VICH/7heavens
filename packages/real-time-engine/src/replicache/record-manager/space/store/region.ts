import type { StoreRegion } from "@medusajs/types";
import { Effect } from "effect";
import { Cloudflare } from "../../../../context";
import type { Row } from "../../../../types/replicache";
import type { GetRows } from "../types";

export const regionCVD: GetRows = () =>
	Effect.gen(function* () {
		const { env } = yield* Cloudflare;
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
		return yield* Effect.succeed(regions as any as Row[]);
	});
