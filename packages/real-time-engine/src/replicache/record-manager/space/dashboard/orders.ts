import { Effect } from "effect";
import type { GetRows } from "../types";

export const ordersCVD: GetRows = () =>
	Effect.gen(function* (_) {
		return yield* Effect.succeed([]);
	});
