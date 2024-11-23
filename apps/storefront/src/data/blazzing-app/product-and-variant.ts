import { env } from "@/app/env";
import type { Product, Variant } from "@blazzing-app/validators/client";
import { unstable_cache } from "next/cache";
import { client } from "./client";

export const getProductById = unstable_cache(async (id: string) => {
	const response = await client.product.id.$get(
		{
			query: {
				id,
				storeID: env.BLAZZING_STORE_ID,
			},
		},
		{
			headers: {
				"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
			},
		},
	);
	if (response.ok) {
		const { result } = await response.json();
		return result[0] ?? (null as any as Product | null);
	}
	return null;
});

export const getProductByHandle = unstable_cache(async (handle: string) => {
	const response = await client.product.handle.$get(
		{
			query: {
				handle,
				storeID: env.BLAZZING_STORE_ID,
			},
		},
		{
			headers: {
				"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
			},
		},
	);
	if (response.ok) {
		const { result } = await response.json();
		return result[0] ?? (null as any as Product | null);
	}
	return null;
});

export const getProductsByHandles = unstable_cache(async (handle: string[]) => {
	const response = await client.product.handle.$get(
		{
			query: {
				handle,
				storeID: env.BLAZZING_STORE_ID,
			},
		},
		{
			headers: {
				"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
			},
		},
	);
	if (response.ok) {
		const { result } = await response.json();
		return result as any as Product[];
	}
	return [];
});
export const getVariantByHandle = unstable_cache(async (handle: string) => {
	const response = await client.variant.handle.$get(
		{
			query: {
				handle,
				storeID: env.BLAZZING_STORE_ID,
			},
		},
		{
			headers: {
				"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
			},
		},
	);
	if (response.ok) {
		const { result } = await response.json();
		return result[0] ?? (null as any as Variant | null);
	}
	return null;
});

export const getVariantsByHandles = unstable_cache(async (handle: string[]) => {
	const response = await client.variant.handle.$get(
		{
			query: {
				handle,
				storeID: env.BLAZZING_STORE_ID,
			},
		},
		{
			headers: {
				"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
			},
		},
	);
	if (response.ok) {
		const { result } = await response.json();
		return result as any as Variant[];
	}
	return [];
});

export const getProducts = unstable_cache(async () => {
	const response = await client.product.list.$get(
		{
			query: {
				storeID: env.BLAZZING_STORE_ID,
			},
		},
		{
			headers: {
				"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
			},
		},
	);
	if (response.ok) {
		const { result } = await response.json();
		return result as any as Product[];
	}
	return [];
});

export const getProductsByCollectionHandle = unstable_cache(
	async (handle: string) => {
		const response = await client.product["collection-handle"].$get(
			{
				query: {
					handle,
					storeID: env.BLAZZING_STORE_ID,
				},
			},
			{
				headers: {
					"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
				},
			},
		);
		if (response.ok) {
			const { result } = await response.json();
			return result as any as Product[];
		}
		return [];
	},
);
