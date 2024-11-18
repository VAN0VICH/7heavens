import type { StoreCartLineItem, StoreOrderLineItem } from "@medusajs/types";

import { omit } from "lodash";

import { Effect } from "effect";
import { getProductsByIds } from "./products";

export function enrichLineItems<
	T extends StoreCartLineItem | StoreOrderLineItem,
>(lineItems: T[] | null, regionId?: string) {
	return Effect.gen(function* () {
		if (!lineItems?.length) return [];

		const { products } = yield* getProductsByIds(
			lineItems.map((lineItem) => lineItem.product_id!),
			regionId!,
		);

		if (!products?.length) return lineItems;

		const productMap = new Map(
			products.map((product) => [product.id, product]),
		);
		const variantMap = new Map(
			products.flatMap(
				(product) =>
					product.variants?.map((variant) => [
						variant.id,
						{ ...variant, product },
					]) ?? [],
			),
		);

		return lineItems.map((item) => {
			const product = productMap.get(item.product_id!);
			const variant = variantMap.get(item.variant_id!);

			if (!product || !variant) return item;

			const omittedProduct = omit(product, "variants");
			return {
				...item,
				product: omittedProduct,
				variant: {
					...variant,
					product: omittedProduct,
				},
			};
		}) as T[];
	});
}
