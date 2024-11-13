import medusa from "./client";

export const getCollectionByHandle = async (handle: string, page: number) => {
	"use cache";
	const limit = 12;
	const offset = (page - 1) * limit;

	const collection = await medusa.store.collection
		.list(
			{
				handle,
			},
			{ next: { tags: ["collections"] } },
		)
		.then(({ collections }) => collections[0]);

	if (!collection) {
		return null;
	}

	const { count, products } = await medusa.store.product.list(
		{
			collection_id: collection.id,
			fields: "+images.*,+variants.*",
			limit,
			offset,
		},
		{ next: { tags: ["products"] } },
	);

	return {
		collection,
		hasNextPage: count > offset + limit,
		products,
	};
};

export const getCollections = async () => {
	return await medusa.store.collection.list(
		{ fields: "id,title" },
		{ next: { tags: ["collections"] } },
	);
};
