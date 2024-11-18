import { index, pgTable, varchar } from "drizzle-orm/pg-core";

export const carts = pgTable(
	"carts",
	{
		id: varchar("id").notNull().primaryKey(),
		medusaId: varchar("medusa_id").notNull(),
	},
	(cart) => ({
		medusaIdIndex: index("medusa_id_index_cart").on(cart.medusaId),
	}),
);
