/** @type {import('next').NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{ hostname: "imagedelivery.net" },
			{ hostname: "cdn.sanity.io" },
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
		dynamicIO: true,
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
