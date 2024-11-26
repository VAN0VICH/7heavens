"use server";
import { env } from "@/app/env";
import type { StoreOrder } from "@blazzing-app/validators";
import { unstable_cache } from "next/cache";
import { client } from "./client";

export const getOrder = unstable_cache(async (id: string | string[]) => {
	const response = await client.order.id.$get(
		{
			query: {
				id,
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
		return result ?? (null as any as StoreOrder[]);
	}
	return [];
});
