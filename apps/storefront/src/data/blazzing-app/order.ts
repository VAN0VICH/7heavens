"use server";
import type { StoreOrder } from "@blazzing-app/validators";
import { client } from "./client";

export const getOrder = async (id: string | string[]) => {
	const response = await client.order.id.$get(
		{
			query: {
				id,
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
		return result ?? (null as any as StoreOrder[]);
	}
	return [];
};
