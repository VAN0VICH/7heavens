import type { StoreProductParams } from "@medusajs/types";

import medusa from "./client";

export const getProductByHandle = async (handle: string, region_id: string) => {
	"use cache";
	return medusa.store.product
		.list(
			{
				fields: "*variants.calculated_price,+variants.inventory_quantity",
				handle,
				region_id,
			},
			{ next: { tags: ["products"] } },
		)
		.then(({ products }) => products[0]);
};

export const getProductsByIds = async (ids: string[], region_id: string) => {
	"use cache";
	return medusa.store.product.list(
		{
			id: ids,
			region_id,
		},
		{ next: { tags: ["products"] } },
	);
};
export const getProducts = async (
	page: number,
	region_id: string,
	query?: Omit<StoreProductParams, "fields" | "limit" | "offset" | "region_id">,
) => {
	"use cache";
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
};
