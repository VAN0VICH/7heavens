import type { Category } from "@/types/sanity.generated";
import type { StoreProductCategory } from "@medusajs/types";
import { unstable_cacheTag as cacheTag } from "next/cache";

import medusa from "./client";

export const getCategoryByHandle = async (handle: string[], page: number) => {
	"use cache";
	cacheTag("category");
	const limit = 12;
	const offset = (page - 1) * limit;
	if (handle.length === 0) {
		return null;
	}

	const category = await medusa.store.category
		.list(
			{
				fields: "+sanity_category.*",
				handle: handle[handle.length - 1]!,
			},
			{ next: { tags: ["category"] } },
		)
		.then(
			({ product_categories }) =>
				product_categories[0] as {
					sanity_category: Category;
				} & StoreProductCategory,
		);

	const { count, products } = await medusa.store.product.list(
		{
			category_id: category.id,
			fields: "+images.*,+variants.*",
			limit,
			offset,
		},
		{ next: { tags: ["products"] } },
	);

	return {
		category,
		hasNextPage: count > offset + limit,
		products,
	};
};

export const getCategories = async () => {
	"use cache";
	cacheTag("categories");
	return await medusa.store.category.list(
		{ fields: "id,name" },
		{ next: { tags: ["categories"] } },
	);
};
