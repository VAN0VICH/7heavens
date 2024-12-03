import type { StoreProduct, StoreVariant } from "@blazzing-app/validators";
import { unstable_cache } from "next/cache";
import { client } from "./client";

export const getProductById = unstable_cache(
	async (id: string) => {
		const response = await client.product.id.$get(
			{
				query: {
					id,
					storeID: process.env.BLAZZING_STORE_ID ?? "",
				},
			},
			{
				headers: {
					"x-publishable-key":
						process.env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY ?? "",
				},
			},
		);
		if (response.ok) {
			const { result } = await response.json();
			return result[0] ?? (null as any as StoreProduct | null);
		}
		return null;
	},
	["products"],
);

export const getProductByHandle = unstable_cache(
	async (handle: string) => {
		const response = await client.product.handle.$get(
			{
				query: {
					handle,
					storeID: process.env.BLAZZING_STORE_ID ?? "",
				},
			},
			{
				headers: {
					"x-publishable-key":
						process.env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY ?? "",
				},
			},
		);
		if (response.ok) {
			const { result } = await response.json();
			return result[0] ?? (null as any as StoreProduct | null);
		}
		return null;
	},
	["products"],
);

export const getProductsByHandles = unstable_cache(
	async (handle: string[]) => {
		const response = await client.product.handle.$get(
			{
				query: {
					handle,
					storeID: process.env.BLAZZING_STORE_ID ?? "",
				},
			},
			{
				headers: {
					"x-publishable-key":
						process.env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY ?? "",
				},
			},
		);
		if (response.ok) {
			const { result } = await response.json();
			return result as any as StoreProduct[];
		}
		return [];
	},
	["products"],
);
export const getVariantByHandle = unstable_cache(
	async (handle: string) => {
		const response = await client.variant.handle.$get(
			{
				query: {
					handle,
					storeID: process.env.BLAZZING_STORE_ID ?? "",
				},
			},
			{
				headers: {
					"x-publishable-key":
						process.env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY ?? "",
				},
			},
		);
		if (response.ok) {
			const { result } = await response.json();
			return result[0] ?? (null as any as StoreVariant | null);
		}
		return null;
	},
	["products"],
);

export const getVariantsByHandles = unstable_cache(
	async (handle: string[]) => {
		const response = await client.variant.handle.$get(
			{
				query: {
					handle,
					storeID: process.env.BLAZZING_STORE_ID ?? "",
				},
			},
			{
				headers: {
					"x-publishable-key":
						process.env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY ?? "",
				},
			},
		);
		if (response.ok) {
			const { result } = await response.json();
			return result as any as StoreVariant[];
		}
		return [];
	},
	["products"],
);

export const getProducts = unstable_cache(async () => {
	const response = await client.product.list.$get(
		{
			query: {
				storeID: process.env.BLAZZING_STORE_ID ?? "",
			},
		},
		{
			headers: {
				"x-publishable-key":
					process.env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY ?? "",
			},
		},
	);
	if (response.ok) {
		const { result } = await response.json();
		return result as any as StoreProduct[];
	}
	return [];
}, ["products"]);

export const getProductsByCollectionHandle = unstable_cache(
	async (handle: string) => {
		const response = await client.product["collection-handle"].$get(
			{
				query: {
					handle,
					storeID: process.env.BLAZZING_STORE_ID ?? "",
				},
			},
			{
				headers: {
					"x-publishable-key":
						process.env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY ?? "",
				},
			},
		);
		if (response.ok) {
			const { result } = await response.json();
			return result as any as StoreProduct[];
		}
		return [];
	},
	["products"],
);
