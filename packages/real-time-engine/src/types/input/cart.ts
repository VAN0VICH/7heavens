import { z } from "zod";

const CreateCartSchema = z.object({
	cartId: z.string(),
	regionId: z.string(),
});

type CreateCart = z.infer<typeof CreateCartSchema>;
const UpdateCartSchema = z.object({
	cartId: z.string(),
	data: z.object({
		email: z.string().optional(),
	}),
});

type UpdateCart = z.infer<typeof UpdateCartSchema>;

export { CreateCartSchema, UpdateCartSchema };
export type { CreateCart, UpdateCart };
