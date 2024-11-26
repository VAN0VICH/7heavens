"use server";

import { cookies } from "next/headers";

export async function setCartId(cartId: string): Promise<void> {
	if (!cartId) {
		throw new Error("cartId is required");
	}

	const cookieStore = cookies();

	(await cookieStore).set("cart_id", cartId, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	});
}
