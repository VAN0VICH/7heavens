import { env } from "./env";

const baseUrl = env.WEB_URL ?? "";

const config = {
	backendUrl:
		process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000/store",
	baseUrl,
	defaultCountryCode: "us",
	sanity: {
		apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-06-21",
		projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
		revalidateSecret: env.SANITY_REVALIDATE_SECRET || "",
		dataset: env.NEXT_PUBLIC_SANITY_DATASET || "",
		studioUrl: "/cms",
		// Not exposed to the front-end, used solely by the server
		token: env.SANITY_API_TOKEN || "",
	},
	siteName: "7heavens",
};

export default config;
