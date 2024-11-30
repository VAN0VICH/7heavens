"use server";

import { cookies } from "next/headers";

export async function setTempUserID(userID: string): Promise<void> {
	if (!userID) {
		throw new Error("cartId is required");
	}

	const cookieStore = cookies();

	(await cookieStore).set("temp_user_id", userID, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		path: "/",
	});
}
