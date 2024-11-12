import { env } from "@/env";
import Medusa from "@medusajs/js-sdk";

const medusa = new Medusa({
	baseUrl: env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
	// debug: process.env.NODE_ENV === "development",
	publishableKey: env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

export default medusa;
