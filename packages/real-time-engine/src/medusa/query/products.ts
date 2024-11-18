import type { StoreProduct, StoreProductParams } from "@medusajs/types";

import { Effect } from "effect";
import { Cloudflare } from "../../context";
import { MedusaError } from "../../types/errors";

export const getProductsByIds = (ids: string[], region_id: string) =>
	Effect.gen(function* () {
		const { env } = yield* Cloudflare; // Assuming you're using a Cloudflare environment

		// Construct query parameters
		const queryParams = new URLSearchParams({
			id: ids.join(","), // Combine IDs into a comma-separated string
			region_id, // Include the region ID
		});

		return yield* Effect.tryPromise(() =>
			fetch(`${env.MEDUSA_BACKEND_URL}/products?${queryParams.toString()}`, {
				headers: {
					"x-publishable-api-key": env.MEDUSA_PUBLISHABLE_KEY,
				},
			}).then(async (res) => {
				if (!res.ok) {
					console.error(
						`Error fetching products: ${res.status} ${res.statusText}`,
					);
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
	});

export const getProducts = async (
	region_id: string,
	env: { MEDUSA_BACKEND_URL: string; MEDUSA_PUBLISHABLE_KEY: string },
	query?: Omit<StoreProductParams, "fields" | "limit" | "offset" | "region_id">,
) => {
	// Construct query parameters
	const queryParams = new URLSearchParams({
		region_id, // Always include region_id
		fields: "+images.*,+variants.*,*variants.calculated_price", // Fixed fields parameter
		...Object.fromEntries(
			Object.entries(query || {}).map(([key, value]) => [key, String(value)]),
		), // Dynamically include other query parameters
	});

	// Perform the fetch
	const response = await fetch(
		`${env.MEDUSA_BACKEND_URL}/products?${queryParams.toString()}`,
		{
			headers: {
				"x-publishable-api-key": env.MEDUSA_PUBLISHABLE_KEY,
			},
		},
	);

	if (!response.ok) {
		console.error(
			`Error fetching products: ${response.status} ${response.statusText}`,
		);
		throw new Error("Failed to fetch products");
	}

	const data = (await response.json()) as { products: StoreProduct[] };

	return {
		products: data.products,
	};
};
