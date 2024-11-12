import type { Effect } from "effect";

import type { AuthContext, ReplicacheContext } from "../../context";
import type { Database } from "../../context/database";
import type { NeonDatabaseError } from "../../../types/errors";
import type { RowsWTableName } from "../../../types/replicache";

export type GetRowsWTableName = ({
	fullRows,
}: {
	fullRows: boolean;
}) => Effect.Effect<
	RowsWTableName[],
	NeonDatabaseError,
	Cloudflare | ReplicacheContext | Database | AuthContext
>;
