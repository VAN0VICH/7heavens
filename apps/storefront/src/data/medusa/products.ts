import type { StoreProductParams } from "@medusajs/types";

import { unstable_cache } from "next/cache";

import medusa from "./client";

export const getProductByHandle = unstable_cache(
	async (handle: string, region_id: string) =>
		medusa.store.product
			.list(
				{
					fields: "*variants.calculated_price,+variants.inventory_quantity",
					handle,
					region_id,
				},
				{ next: { tags: ["products"] } },
			)
			.then(({ products }) => products[0]),
	["product"],
	{
		revalidate: 120,
	},
);

export const getProductsByHandles = unstable_cache(
	async (handles: string[], region_id: string) => {
		const promises = [];

		for (const handle of handles) {
			promises.push(getProductByHandle(handle, region_id));
		}

		return Promise.all(promises);
	},
	["products"],
	{
		revalidate: 120,
	},
);

export const getProductsByIds = unstable_cache(
	async (ids: string[], region_id: string) =>
		medusa.store.product.list(
			{
				id: ids,

				region_id,
			},
			{ next: { tags: ["products"] } },
		),
	["products"],
	{
		revalidate: 120,
	},
);

export const getProducts = unstable_cache(
	async (
		page: number,
		region_id: string,
		query?: Omit<
			StoreProductParams,
			"fields" | "limit" | "offset" | "region_id"
		>,
	) => {
		const limit = 12;
		const offset = (page - 1) * limit;

		const { count, products } = await medusa.store.product.list(
			{
				fields: "+images.*,+variants.*,*variants.calculated_price",
				limit,
				offset,
				region_id,

				...query,
			},
			{ next: { tags: ["products"] } },
		);

		return {
			hasNextPage: count > offset + limit,
			products,
		};
	},
	["products"],
	{
		revalidate: 120,
	},
);

export const getProductsByCollectionHandle =
	// unstable_cache(
	async (handle: string, region_id: string) => {
		const { collections } = await medusa.store.collection.list(
			{
				handle,
			},
			{ next: { tags: ["collection"] } },
		);
		const collectionID = collections[0]?.id;
		if (!collectionID) {
			return { products: [] };
		}
		const { products } = await medusa.store.product.list(
			{
				collection_id: collectionID,
				region_id,
			},
			{ next: { tags: ["products"] } },
		);
		return { products: products ?? [] };
	};
// },
// ["collection"],
// {
// 	revalidate: 120,
// },
// );
