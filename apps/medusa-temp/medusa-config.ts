import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV, process.cwd());

export default defineConfig({
	projectConfig: {
		redisUrl: process.env.REDIS_URL,
		databaseUrl: process.env.DATABASE_URL,
		databaseLogging: true,
		http: {
			storeCors: process.env.STORE_CORS,
			adminCors: process.env.ADMIN_CORS,
			authCors: process.env.AUTH_CORS,
			jwtSecret: process.env.JWT_SECRET || "supersecret",
			cookieSecret: process.env.COOKIE_SECRET || "supersecret",
		},
		workerMode: process.env.MEDUSA_WORKER_MODE as
			| "shared"
			| "worker"
			| "server",
	},
	admin: {
		disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
		backendUrl: process.env.MEDUSA_BACKEND_URL,
		//@ts-ignore
		path: process.env.MEDUSA_ADMIN_PATH,
	},
	modules: [
		// {
		// 	resolve: "./modules/sanity",
		// 	options: {
		// 		api_token: process.env.SANITY_API_TOKEN ?? "",
		// 		project_id: process.env.SANITY_PROJECT_ID ?? "",
		// 		api_version: new Date().toISOString().split("T")[0],
		// 		dataset: "production",
		// 		studio_url: process.env.SANITY_STUDIO_URL ?? "",
		// 		type_map: {
		// 			collection: "collection",
		// 			category: "category",
		// 			product: "product",
		// 		},
		// 	},
		// },
		{
			resolve: "@medusajs/medusa/cache-redis",
			options: {
				redisUrl: process.env.REDIS_URL,
			},
		},
		{
			resolve: "@medusajs/medusa/event-bus-redis",
			options: {
				redisUrl: process.env.REDIS_URL,
			},
		},
		{
			resolve: "@medusajs/medusa/workflow-engine-redis",
			options: {
				redis: {
					url: process.env.REDIS_URL,
				},
			},
		},
		{
			resolve: "@medusajs/medusa/file",
			options: {
				providers: [
					{
						resolve: "@medusajs/medusa/file-s3",
						id: "s3",
						options: {
							file_url: process.env.S3_FILE_URL,
							access_key_id: process.env.S3_ACCESS_KEY_ID,
							secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
							region: process.env.S3_REGION,
							bucket: process.env.S3_BUCKET,
							endpoint: process.env.S3_ENDPOINT,
							additional_client_config: {
								forcePathStyle: true,
							},
							// other options...
						},
					},
				],
			},
		},
	],
});