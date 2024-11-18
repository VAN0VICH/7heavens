import { z } from "zod";

const CreateLineItemSchema = z.object({
	lineItemInput: z.object({
		quantity: z.number(),
		variantId: z.string(),
		cartId: z.string(),
		regionId: z.string(),
		id: z.string(),
	}),
	newCartId: z.string().optional(),
});

type CreateLineItem = z.infer<typeof CreateLineItemSchema>;

const UpdateLineItemSchema = z.object({
	quantity: z.number(),
	id: z.string(),
	cartId: z.string(),
});

type UpdateLineItem = z.infer<typeof UpdateLineItemSchema>;

export { CreateLineItemSchema, UpdateLineItemSchema };
export type { CreateLineItem, UpdateLineItem };
