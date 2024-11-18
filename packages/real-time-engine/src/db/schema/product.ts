import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
	id: varchar("id").notNull().primaryKey(),
	available: boolean("available"),
});
