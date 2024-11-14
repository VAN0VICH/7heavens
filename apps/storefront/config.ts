import { env } from "./src/app/env";

const baseUrl = process.env.WEB_URL ?? "http://localhost:3000";

const config = {
	backendUrl: env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
	baseUrl,
	defaultCountryCode: "by",
	sanity: {
		apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-06-21",
		projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
		revalidateSecret: process.env.SANITY_REVALIDATE_SECRET || "",
		dataset: env.NEXT_PUBLIC_SANITY_DATASET || "",
		studioUrl: "/cms",
		// Not exposed to the front-end, used solely by the server
		token: process.env.SANITY_API_TOKEN || "",
	},
	siteName: "7heavens",
};

export default config;
