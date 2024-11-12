import type { Effect } from "effect";
import type { z, ZodError } from "zod";

import type {
	InvalidValue,
	NeonDatabaseError,
	NotFound,
} from "../../types/errors";
import type { AuthContext, Database } from "../context";

export function fn<Schema extends z.ZodSchema>(
	schema: Schema,
	func: (
		value: z.infer<Schema>,
	) => Effect.Effect<
		void,
		ZodError | NeonDatabaseError | NotFound | InvalidValue,
		Database | Cloudflare | AuthContext
	>,
) {
	const result = (input: z.infer<Schema>) => {
		const parsed = schema.parse(input);

		return func(parsed);
	};

	return result;
}
