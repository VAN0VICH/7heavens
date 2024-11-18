import { Context } from "effect";
import type { SpaceID, SpaceRecord } from "../types/replicache";

class ReplicacheContext extends Context.Tag("TableMutator")<
	ReplicacheContext,
	{
		spaceID: SpaceID;
		subspaceIDs: SpaceRecord[SpaceID] | undefined;
		clientGroupID: string;
	}
>() {}
export { ReplicacheContext };
