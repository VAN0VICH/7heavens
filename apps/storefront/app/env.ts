import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		SANITY_API_TOKEN: z.string(),
		WEB_URL: z.string(),
		SANITY_REVALIDATE_SECRET: z.string().optional(),
	},
	client: {
		NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
		NEXT_PUBLIC_SANITY_API_VERSION: z.string(),
		NEXT_PUBLIC_MEDUSA_BACKEND_URL: z.string(),
		NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_SANITY_DATASET: z.string(),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
		NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
		NEXT_PUBLIC_MEDUSA_BACKEND_URL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
		NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
		NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
	},
	// For Next.js >= 13.4.4, you only need to destructure client variables:
	// experimental__runtimeEnv: {
	//   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
	// }
});
