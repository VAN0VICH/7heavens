"use server";

import { env } from "@/app/env";
import { z } from "zod";

const newsletterSchema = z.object({
	email: z.string().email(),
});

export async function newsletterForm(
	_: string,
	formData: FormData,
): Promise<string> {
	const { data, success } = newsletterSchema.safeParse(
		Object.fromEntries(formData),
	);
	if (!success) return "error";
	const { email } = data;

	try {
		const res = await fetch(
			`${env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/subscribe-to-newsletter`,
			{
				body: JSON.stringify({
					email,
				}),
				headers: {
					"Content-Type": "application/json",
					"X-Publishable-Api-Key": env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
				},
				method: "post",
			},
		);

		if (!res.ok) throw new Error("req failed");

		return "success";
	} catch (error) {
		return "error";
	}
}
