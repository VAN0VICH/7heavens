"use server";

import { revalidateTag } from "next/cache";

export async function revalidateProducts() {
	return revalidateTag("products");
}
