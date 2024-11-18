import { index, pgTable, varchar } from "drizzle-orm/pg-core";

export const lineItems = pgTable(
	"line-items",
	{
		id: varchar("id").notNull().primaryKey(),
		medusaId: varchar("medusa_id").notNull(),
	},
	(item) => ({
		medusaIdIndex: index("medusa_id_index_item").on(item.medusaId),
	}),
);
