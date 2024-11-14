import { Effect } from "effect";
import type { GetRowsWTableName } from "../types";

export const ordersCVD: GetRowsWTableName = () =>
	Effect.gen(function* (_) {
		return yield* Effect.succeed([]);
	});
