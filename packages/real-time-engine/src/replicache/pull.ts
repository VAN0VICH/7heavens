import { Clock, Console, Effect, Layer } from "effect";
import type { PatchOperation, PullResponseOKV1 } from "replicache";

import { ulid } from "ulidx";
import type { Db } from "../db";
import {
	type InvalidValue,
	type MedusaError,
	NeonDatabaseError,
	type NotFound,
} from "../types/errors";
import type { Cookie, PullRequest } from "../types/replicache";
import { AuthContext, type Cloudflare, Database } from "../context";
import { ReplicacheContext } from "../context/replicache";
import { RecordManager } from "./record-manager";
import type { ZodError } from "zod";

export const pull = ({
	body: pull,
	db,
}: {
	body: PullRequest;
	db: Db;
}): Effect.Effect<
	PullResponseOKV1,
	NeonDatabaseError | InvalidValue | MedusaError | ZodError<any> | NotFound,
	ReplicacheContext | Cloudflare | AuthContext
> =>
	Effect.gen(function* (_) {
		const { spaceID } = yield* ReplicacheContext;
		const { authUser } = yield* AuthContext;
		const requestCookie = pull.cookie;
		yield* _(Effect.log(`SPACE ID ${spaceID}`));

		if (spaceID === "dashboard" && !authUser) {
			yield* _(Effect.log("not authorized"));
			const resp: PullResponseOKV1 = {
				lastMutationIDChanges: {},
				//@ts-ignore
				cookie: requestCookie,
				patch: [],
			};
			return resp;
		}
		yield* _(
			Effect.log("----------------------------------------------------"),
		);

		yield* _(Effect.log(`PROCESSING PULL: ${JSON.stringify(pull, null, "")}`));

		const startTransact = yield* _(Clock.currentTimeMillis);

		// 1: GET PREVIOUS SPACE RECORD AND CLIENT RECORD KEYS
		const oldClientRecordKey = requestCookie?.clientRecordKey;

		// 2: BEGIN PULL TRANSACTION
		const processPull = yield* _(
			Effect.tryPromise(() =>
				db.transaction(
					async (transaction) =>
						Effect.gen(function* (_) {
							const newClientRecordKey = ulid();

							// 4: GET PREVIOUS AND CURRENT RECORDS. (1 ROUND TRIP TO THE DATABASE)
							const [
								spaceRecord,
								oldClientRecord,
								newClientRecord,
								clientGroupObject,
							] = yield* _(
								Effect.all(
									[
										RecordManager.getSpaceRecord(),
										RecordManager.getOldClientRecord({
											key: oldClientRecordKey,
										}),
										RecordManager.getNewClientRecord(),
										RecordManager.getClientGroupObject(),
									],
									{
										concurrency: 4,
									},
								),
							);
							yield* Console.log("space record", spaceRecord);

							const currentTime = yield* _(Clock.currentTimeMillis);

							yield* _(
								Effect.log(
									`TOTAL TIME OF GETTING RECORDS ${
										currentTime - startTransact
									}`,
								),
							);

							// 5: GET RECORDS DIFF
							const clientDiff = yield* RecordManager.diffClientRecords({
								prevRecord: oldClientRecord,
								currentRecord: newClientRecord,
							});
							// 5: GET THE PATCH

							const spacePatch = yield* RecordManager.createSpacePatch({
								spaceRecord,
							});

							// ADD INDICATION THAT THE CLIENT HAS PULLED.
							spacePatch.push({
								key: "init",
								op: "put",
								value: "true",
							} satisfies PatchOperation);

							// 6: PREPARE UPDATES
							const oldSpaceRecordVersion = Math.max(
								clientGroupObject.spaceRecordVersion,
								requestCookie?.order ?? 0,
							);
							const nextSpaceRecordVersion = oldSpaceRecordVersion + 1;
							clientGroupObject.spaceRecordVersion = nextSpaceRecordVersion;

							const nothingToUpdate =
								spacePatch.length === 0 && Object.keys(clientDiff).length === 0;

							// 7: CREATE THE PULL RESPONSE
							const resp: PullResponseOKV1 = {
								lastMutationIDChanges: clientDiff,
								cookie: {
									...requestCookie,
									clientRecordKey: nothingToUpdate
										? oldClientRecordKey
										: newClientRecordKey,
									order: nothingToUpdate
										? oldSpaceRecordVersion
										: nextSpaceRecordVersion,
								} satisfies Cookie,
								patch: spacePatch,
							};
							yield* _(Effect.log(`pull response ${JSON.stringify(resp)}`));

							// 8: UPDATE RECORDS IF THERE ARE CHANGES. (3D ROUND TRIP TO THE DATABASE)
							if (!nothingToUpdate) {
								yield* _(Effect.log("UPDATING RECORDS"));
								yield* _(
									Effect.all(
										[
											RecordManager.setClientGroupObject({ clientGroupObject }),
											RecordManager.setClientRecord({
												newClientRecord,
												newKey: newClientRecordKey,
											}),
											RecordManager.deleteClientRecord({
												key: oldClientRecordKey,
											}),
										],
										{
											concurrency: 3,
										},
									),
								);
							}

							return resp;
						}).pipe(
							Effect.provide(
								Layer.succeed(Database, {
									manager: transaction,
								}),
							),
						),
					{ isolationLevel: "repeatable read", accessMode: "read write" },
				),
			).pipe(
				Effect.catchTags({
					UnknownException: (error) =>
						new NeonDatabaseError({
							message: error.message,
						}),
				}),
			),
		);

		const response = yield* _(processPull);

		const endTransact = yield* _(Clock.currentTimeMillis);

		yield* _(Effect.log(`TOTAL TIME ${endTransact - startTransact}`));

		yield* _(
			Effect.log("----------------------------------------------------"),
		);

		return response;
	});
