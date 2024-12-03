import type { StoreProduct, StoreVariant } from "@blazzing-app/validators";
import { client } from "./client";
export const getProductById = async (id: string) => {
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
};

export const getProductByHandle = async (handle: string) => {
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
};

export const getProductsByHandles = async (handle: string[]) => {
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
};
export const getVariantByHandle = async (handle: string) => {
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
};

export const getVariantsByHandles = async (handle: string[]) => {
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
};

export const getProducts = async () => {
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
};

export const getProductsByCollectionHandle = async (handle: string) => {
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
};
