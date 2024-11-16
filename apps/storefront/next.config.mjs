import { fileURLToPath } from "node:url";
import createJiti from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/app/env");
/** @type {import('next').NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{ hostname: "cdn.sanity.io" },
			{ hostname: "pstgvehexiavdctgqhpn.supabase.co" },
			{ hostname: "munchies.medusajs.app" },
			{ hostname: "tinloof-munchies.s3.eu-north-1.amazonaws.com" },
			{ hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com" },
		],
		formats: ["image/avif", "image/webp"],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	experimental: {
		taint: true,
	},
	rewrites() {
		return [
			{
				source:
					"/:path((?!us|by|dk|fr|de|es|jp|gb|ca|ar|za|mx|my|au|nz|dz|br|cms|api|images|icons|favicon.ico|sections|favicon-inactive.ico).*)",
				destination: "/by/:path*",
			},
		];
	},
};

export default config;
