import { createInsertSchema } from "drizzle-zod";
import type { PatchOperation } from "replicache";
import { z } from "zod";

import { Schema } from "@effect/schema";
import { schema } from "../db";
export type TableName =
	| "replicache_clients"
	| "replicache_client_groups"
	| "replicache_subspace_records"
	| "orders"
	| "user"
	| "cart";
export const clientGroupSchema = createInsertSchema(
	// @ts-ignore
	schema.replicacheClientGroups,
);

export type ClientGroupObject = z.infer<typeof clientGroupSchema>;
export const ReplicacheClientSchema = createInsertSchema(
	// @ts-ignore
	schema.replicacheClients,
);
export type ReplicacheClient = z.infer<typeof ReplicacheClientSchema>;
export const ReplicacheSubspaceRecordSchema = createInsertSchema(
	// @ts-ignore
	schema.replicacheSubspaceRecords,
).extend({
	record: z.record(z.string(), z.number()),
});
export type ReplicacheSubspaceRecord = z.infer<
	typeof ReplicacheSubspaceRecordSchema
>;
export type ClientViewRecord = Record<string, number>;
export type Row = Record<string, unknown> & { id: string };
export const SPACE_RECORD = {
	store: ["products" as const],
	dashboard: ["orders" as const],
};
export const SpaceIDSchema = Schema.Literal("dashboard", "store");
export type SpaceID = Schema.Schema.Type<typeof SpaceIDSchema>;

export type SpaceRecord = typeof SPACE_RECORD;

export const MutationSchema = z.object({
	id: z.number(),
	name: z.string(),
	args: z.unknown(),
	clientID: z.string(),
});
export type Mutation = z.infer<typeof MutationSchema>;
export const PushRequestSchema = z.object({
	clientGroupID: z.string(),
	mutations: z.array(MutationSchema),
});
export type PushRequest = z.infer<typeof PushRequestSchema>;
export type PullResponse = {
	cookie: string;
	lastMutationIDChanges: Record<string, number>;
	patch: PatchOperation[];
};
export const CookieSchema = z.object({
	spaceRecordKey: z.string().optional(),
	clientRecordKey: z.string().optional(),
	staticPullKey: z.string().optional(),
	order: z.number(),
});

export type Cookie = z.infer<typeof CookieSchema>;

export const PullRequestSchema = z.object({
	clientGroupID: z.string(),
	cookie: z.nullable(CookieSchema),
});
export type PullRequest = z.infer<typeof PullRequestSchema>;
