import { Effect } from "effect";
import type {
	SpaceID,
	SpaceRecord,
	TableName,
} from "../../../types/replicache";
import { ordersCVD } from "./dashboard/orders";
import type { GetRowsWTableName } from "./types";

export type SpaceRecordGetterType = {
	[K in SpaceID]: Record<SpaceRecord[K][number], GetRowsWTableName>;
};
export const SpaceRecordGetter: SpaceRecordGetterType = {
	dashboard: {
		orders: ordersCVD,
	},
	// store: {},
};
export const fullRowsGetter = (tableName: TableName, keys: string[]) =>
	Effect.gen(function* () {
		console.log("keys", keys);
		if (tableName === "orders") {
			return yield* Effect.succeed([] as Array<{ id: string | null }>);
		}

		return yield* Effect.succeed([] as Array<{ id: string | null }>);
	});
