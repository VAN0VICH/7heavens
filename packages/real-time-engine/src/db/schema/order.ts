import { pgTable, varchar } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
	id: varchar("id").notNull().primaryKey(),
});
