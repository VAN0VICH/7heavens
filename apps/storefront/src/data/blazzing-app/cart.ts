import { cache } from "react";

import { env } from "@/app/env";
import type { Cart } from "@blazzing-app/validators/client";
import { client } from "./client";
import { getCartId } from "./cookies";

export const getCart = cache(async () => {
	const cartId = await getCartId();

	if (!cartId) {
		return null;
	}

	const response = await client.cart.cart.$get(
		{
			param: {
				id: cartId,
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
		return result ?? (null as any as Cart | null);
	}
	return null;
});
