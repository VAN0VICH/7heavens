import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		SANITY_API_TOKEN: z.string(),
		WEB_URL: z.string(),
		SANITY_REVALIDATE_SECRET: z.string().optional(),
		BLAZZING_STORE_ID: z.string(),
	},
	client: {
		NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
		NEXT_PUBLIC_SANITY_API_VERSION: z.string(),
		NEXT_PUBLIC_SANITY_DATASET: z.string(),
		NEXT_PUBLIC_BLAZZING_APP_WORKER_URL: z.string(),
		NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY: z.string(),
		NEXT_PUBLIC_REPLICACHE_KEY: z.string(),
		NEXT_PUBLIC_PARTYKIT_HOST: z.string(),
	},
	runtimeEnv: {
		SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
		NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
		NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
		NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
		NEXT_PUBLIC_REPLICACHE_KEY: process.env.NEXT_PUBLIC_REPLICACHE_KEY,
		NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
		NEXT_PUBLIC_BLAZZING_APP_WORKER_URL:
			process.env.NEXT_PUBLIC_BLAZZING_APP_WORKER_URL,
		NEXT_PUBLIC_PARTYKIT_HOST: process.env.NEXT_PUBLIC_PARTYKIT_HOST,
		BLAZZING_STORE_ID: process.env.BLAZZING_STORE_ID,
		SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
		WEB_URL: process.env.WEB_URL,
	},
	// For Next.js >= 13.4.4, you only need to destructure client variables:
	// experimental__runtimeEnv: {
	//   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
	// }
});
