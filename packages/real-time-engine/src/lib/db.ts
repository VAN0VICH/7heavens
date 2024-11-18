import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { schema } from "../db";
const getDB = ({ connectionString }: { connectionString: string }) => {
	const client = new Pool({
		connectionString,
		connectionTimeoutMillis: 30000,
		idleTimeoutMillis: 30000,
	});
	const db = drizzle(client, { schema });
	return db;
};
export { getDB };
