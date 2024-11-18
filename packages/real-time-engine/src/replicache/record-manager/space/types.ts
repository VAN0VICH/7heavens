import type { Effect } from "effect";

import type {
	InvalidValue,
	MedusaError,
	NeonDatabaseError,
	NotFound,
} from "../../../types/errors";
import type { Row } from "../../../types/replicache";
import type {
	AuthContext,
	Cloudflare,
	Database,
	ReplicacheContext,
} from "../../../context";
import type { ZodError } from "zod";

export type GetRows = () => Effect.Effect<
	Row[],
	NeonDatabaseError | MedusaError | ZodError<any> | NotFound | InvalidValue,
	Cloudflare | ReplicacheContext | Database | AuthContext
>;
