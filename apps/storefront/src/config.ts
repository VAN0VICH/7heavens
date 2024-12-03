const baseUrl = process.env.WEB_URL ?? "http://localhost:3000";

const config = {
	baseUrl,
	defaultCountryCode: "by",
	sanity: {
		apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-06-21",
		projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
		revalidateSecret: process.env.SANITY_REVALIDATE_SECRET || "",
		dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
		studioUrl: "/cms",
		// Not exposed to the front-end, used solely by the server
		token: process.env.SANITY_API_TOKEN || "",
	},
	siteName: "7heavens",
};

export default config;
