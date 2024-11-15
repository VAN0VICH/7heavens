import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
	path: "../../.env",
});

export default defineConfig({
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
	schema: "./src/db/schema",
	strict: true,
	verbose: true,
});
