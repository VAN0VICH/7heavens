import { eq, inArray } from "drizzle-orm";
import { Effect, pipe } from "effect";
import { isDefined, mapToObj } from "remeda";
import type { PatchOperation, ReadonlyJSONObject } from "replicache";
import { schema } from "../../db";
import type { ExtractEffectValue } from "../../types/effect";
import {
	InvalidValue,
	type MedusaError,
	NeonDatabaseError,
	type NotFound,
} from "../../types/errors";
import {
	SPACE_RECORD,
	type ClientGroupObject,
	type ClientViewRecord,
	type ReplicacheClient,
	type ReplicacheSubspaceRecord,
	type Row,
	type SpaceID,
	type SpaceRecord,
} from "../../types/replicache";
import { SpaceRecordGetter } from "./space/getter";
import {
	type AuthContext,
	type Cloudflare,
	Database,
	ReplicacheContext,
} from "../../context";
import type { ZodError } from "zod";

type SubspaceRecord = Omit<ReplicacheSubspaceRecord, "version">;

type ClientRecordDiff = Record<string, number>;

export const getRows = <T extends SpaceID>({
	spaceID,
	subspaceID,
}: {
	spaceID: T;
	subspaceID: SpaceRecord[T][number];
}): Effect.Effect<
	Row[],
	InvalidValue | NeonDatabaseError | MedusaError | ZodError<any> | NotFound,
	Cloudflare | ReplicacheContext | Database | AuthContext
> => {
	const rowsGetter = SpaceRecordGetter[spaceID][subspaceID];
	if (rowsGetter) {
		return rowsGetter();
	}

	return Effect.fail(
		new InvalidValue({
			message: "Invalid spaceID or subspaceID",
		}),
	);
};

export const getSpaceRecord = (): Effect.Effect<
	Row[],
	InvalidValue | NeonDatabaseError | MedusaError | ZodError<any> | NotFound,
	Cloudflare | Database | ReplicacheContext | AuthContext
> => {
	return Effect.gen(function* () {
		const { spaceID, subspaceIDs } = yield* ReplicacheContext;

		const subIDs = subspaceIDs ?? SPACE_RECORD[spaceID];

		const result = yield* Effect.forEach(
			subIDs,
			(subspaceID) =>
				getRows({
					spaceID,
					subspaceID,
				}),

			{
				concurrency: "unbounded",
			},
		);
		return result.flat();
	});
};

const getOldClientRecord = ({
	key,
}: {
	key: string | undefined;
}): Effect.Effect<ClientViewRecord | undefined, NeonDatabaseError, Database> =>
	Effect.gen(function* () {
		if (!key) {
			return undefined;
		}
		const { manager } = yield* Database;
		const spaceRecord = yield* Effect.tryPromise(() =>
			manager.query.jsonTable.findFirst({
				where: (json, { eq }) => eq(json.id, key),
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: (error) =>
					new NeonDatabaseError({ message: error.message }),
			}),
		);

		if (spaceRecord?.value) return spaceRecord.value as ClientViewRecord;

		return undefined;
	});

const getNewClientRecord = (): Effect.Effect<
	Pick<ReplicacheClient, "id" | "lastMutationID">[],
	NeonDatabaseError,
	Database | ReplicacheContext
> =>
	Effect.gen(function* () {
		const { manager } = yield* Database;
		const { clientGroupID } = yield* ReplicacheContext;
		return yield* pipe(
			Effect.tryPromise(() =>
				manager
					.select({
						id: schema.replicacheClients.id,
						lastMutationID: schema.replicacheClients.lastMutationID,
					})
					.from(schema.replicacheClients)
					//ASSUME THAT THE CLIENT HAS MAX 20 TABS OPEN
					.where(eq(schema.replicacheClients.clientGroupID, clientGroupID))
					.limit(20),
			),
			Effect.catchTags({
				UnknownException: (error) =>
					new NeonDatabaseError({ message: error.message }),
			}),
		);
	});

const diffClientRecords = ({
	currentRecord,
	prevRecord,
}: {
	prevRecord: ExtractEffectValue<ReturnType<typeof getOldClientRecord>>;
	currentRecord: ExtractEffectValue<ReturnType<typeof getNewClientRecord>>;
}): Effect.Effect<ClientRecordDiff, never, never> => {
	return Effect.gen(function* () {
		const diff: ClientRecordDiff = {};

		if (!prevRecord)
			return mapToObj(currentRecord, (client) => [
				client.id,
				client.lastMutationID,
			]);

		yield* Effect.forEach(
			currentRecord,
			({ id, lastMutationID }) => {
				return Effect.sync(() => {
					if (
						!isDefined(prevRecord[id]) ||
						(prevRecord[id] ?? -1) < lastMutationID
					) {
						diff[id] = lastMutationID;
					}
				});
			},
			{ concurrency: "unbounded" },
		);

		return diff;
	});
};

const createSpacePatch = ({
	spaceRecord,
}: {
	spaceRecord: Row[];
}): Effect.Effect<PatchOperation[], NeonDatabaseError, Database> => {
	return Effect.gen(function* () {
		const patch: PatchOperation[] = [];

		yield* Effect.forEach(
			spaceRecord,
			(item) => {
				return Effect.sync(() => {
					if (item.id) {
						patch.push({
							op: "put",
							key: item.id,
							value: item as ReadonlyJSONObject,
						});
					}
				});
			},
			{ concurrency: "unbounded" },
		);

		return patch;
	});
};

export const getClientGroupObject = (): Effect.Effect<
	ClientGroupObject,
	NeonDatabaseError,
	Database | ReplicacheContext
> =>
	Effect.gen(function* () {
		const { manager } = yield* Database;
		const { clientGroupID } = yield* ReplicacheContext;
		const clientViewData = yield* Effect.tryPromise(() =>
			manager.query.replicacheClientGroups.findFirst({
				where: (clientGroup, { eq }) => eq(clientGroup.id, clientGroupID),
			}),
		).pipe(
			Effect.catchTags({
				UnknownException: (error) =>
					new NeonDatabaseError({ message: error.message }),
			}),
		);

		if (clientViewData) return clientViewData;
		return {
			id: clientGroupID,
			spaceRecordVersion: 0,
			clientVersion: 0,
		};
	});
export const setClientGroupObject = ({
	clientGroupObject,
}: {
	clientGroupObject: ClientGroupObject;
}): Effect.Effect<void, NeonDatabaseError, Database> =>
	Effect.gen(function* () {
		const { manager } = yield* Database;
		yield* Effect.tryPromise(() =>
			manager
				.insert(schema.replicacheClientGroups)
				.values({
					id: clientGroupObject.id,
					spaceRecordVersion: clientGroupObject.spaceRecordVersion,
				})
				.onConflictDoUpdate({
					target: schema.replicacheClientGroups.id,
					set: {
						spaceRecordVersion: clientGroupObject.spaceRecordVersion,
					},
				}),
		).pipe(
			Effect.catchTags({
				UnknownException: (error) =>
					new NeonDatabaseError({ message: error.message }),
			}),
		);
	});

export const setClientRecord = ({
	newClientRecord,
	newKey,
}: {
	newClientRecord: Pick<ReplicacheClient, "id" | "lastMutationID">[];
	newKey: string;
}) => {
	return Effect.gen(function* () {
		if (Object.keys(newClientRecord).length === 0) return;
		const { manager } = yield* Database;
		const clientRecord = mapToObj(newClientRecord, (client) => [
			client.id,
			client.lastMutationID,
		]);
		yield* Effect.tryPromise(() =>
			manager
				.insert(schema.jsonTable)
				.values({
					id: newKey,
					value: clientRecord,
					version: 0,
				})
				.onConflictDoUpdate({
					target: schema.jsonTable.id,
					set: {
						value: clientRecord,
					},
				}),
		).pipe(
			Effect.catchTags({
				UnknownException: (error) =>
					new NeonDatabaseError({ message: error.message }),
			}),
		);
	});
};
export const deleteClientRecord = ({
	key,
}: {
	key: string | undefined;
}): Effect.Effect<void, NeonDatabaseError, Database> =>
	Effect.gen(function* () {
		if (!key) return;
		const { manager } = yield* Database;
		yield* Effect.tryPromise(() =>
			manager.delete(schema.jsonTable).where(eq(schema.jsonTable.id, key)),
		).pipe(
			Effect.catchTags({
				UnknownException: (error) =>
					new NeonDatabaseError({ message: error.message }),
			}),
		);
	});
export const setSpaceRecord = ({
	spaceRecord,
}: {
	spaceRecord: Array<SubspaceRecord>;
}): Effect.Effect<void, NeonDatabaseError, Database> =>
	Effect.gen(function* () {
		const { manager } = yield* Database;
		yield* Effect.tryPromise(() =>
			manager
				.insert(schema.replicacheSubspaceRecords)
				//@ts-ignore
				.values(spaceRecord),
		).pipe(
			Effect.catchTags({
				UnknownException: (error) =>
					new NeonDatabaseError({ message: error.message }),
			}),
		);
	});
export const deleteSpaceRecord = ({
	keys,
}: {
	keys: string[] | undefined;
}): Effect.Effect<void, NeonDatabaseError, Database> =>
	Effect.gen(function* () {
		if (!keys || keys.length === 0) return;
		const { manager } = yield* Database;

		yield* Effect.tryPromise(() =>
			manager
				.delete(schema.replicacheSubspaceRecords)
				.where(inArray(schema.replicacheSubspaceRecords.id, keys)),
		).pipe(
			Effect.catchTags({
				UnknownException: (error) =>
					new NeonDatabaseError({ message: error.message }),
			}),
		);
	});

export {
	createSpacePatch,
	diffClientRecords,
	getNewClientRecord,
	getOldClientRecord,
};
