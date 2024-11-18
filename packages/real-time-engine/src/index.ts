import { zValidator } from "@hono/zod-validator";
import { Effect, Layer } from "effect";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { z } from "zod";
import { AuthContext, Cloudflare, ReplicacheContext } from "./context";
import { getDB } from "./lib/db";
import { pull, push } from "./replicache";
import {
	PullRequestSchema,
	PushRequestSchema,
	type SpaceRecord,
} from "./types/replicache";
import type { WorkerBindings, WorkerEnv } from "./types/worker";
export * from "./replicache";

const app = new Hono<{ Bindings: WorkerBindings & WorkerEnv }>();

app
	.use(logger())
	.use("*", async (c, next) => {
		const wrapped = cors({
			origin:
				c.env.ENVIRONMENT === "production"
					? "https://blazzing.app"
					: [
							"http://localhost:3000",
							"https://development.blazzing-app.pages.dev",
							"https://blazzing-app.com",
							"http://localhost:8788",
						],

			allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PUT"],
			maxAge: 600,
		});
		return wrapped(c, next);
	})
	.use("*", async (c, next) => {
		const wrapped = csrf({
			origin:
				c.env.ENVIRONMENT === "production"
					? "https://blazzing.app"
					: [
							"http://localhost:5173",
							"https://development.blazzing-app.pages.dev",
							"https://blazzing-app.com",
							"http://localhost:8788",
						],
		});
		return wrapped(c, next);
	});

const routes = app
	.post("/hello", (c) => {
		return c.text("hello");
	})
	.post(
		"/pull",
		zValidator(
			"query",
			z.object({
				spaceID: z.enum(["dashboard", "store"] as const),
				subspaces: z.optional(z.array(z.string()).or(z.string())),
			}),
		),
		zValidator("json", PullRequestSchema),
		async (c) => {
			const db = getDB({ connectionString: c.env.DATABASE_URL });
			const { spaceID, subspaces } = c.req.valid("query");
			console.log("--------->SPACE ID<-------", spaceID);
			console.log(
				"--------->Cart id<-------",
				c.req.raw.headers.get("x-cart-id"),
			);
			const body = c.req.valid("json");
			console.log("subspaceIDs", subspaces);

			const CloudflareLive = Layer.succeed(
				Cloudflare,
				Cloudflare.of({
					env: c.env,
					request: c.req.raw,
					bindings: {
						KV: c.env.KV,
					},
				}),
			);
			const ReplicacheContextLive = Layer.succeed(
				ReplicacheContext,
				ReplicacheContext.of({
					spaceID,
					clientGroupID: body.clientGroupID,
					subspaceIDs:
						typeof subspaces === "string"
							? [subspaces as any]
							: (subspaces as SpaceRecord[typeof spaceID] | undefined),
				}),
			);

			const AuthContextLive = Layer.succeed(
				AuthContext,
				AuthContext.of({
					authUser: null,
				}),
			);

			const pullEffect = pull({
				body,
				db,
			}).pipe(
				Effect.provide(AuthContextLive),
				Effect.provide(CloudflareLive),
				Effect.provide(ReplicacheContextLive),
				Effect.orDie,
			);

			const pullResponse = await Effect.runPromise(pullEffect);

			return c.json(pullResponse, 200);
		},
	)
	.post(
		"/push",
		zValidator(
			"query",
			z.object({
				spaceID: z.enum(["dashboard", "store"] as const),
			}),
		),
		zValidator("json", PushRequestSchema),
		async (c) => {
			const db = getDB({ connectionString: c.env.DATABASE_URL });
			const { spaceID } = c.req.valid("query");
			const body = c.req.valid("json");

			const pushEffect = push({
				body,
				db,
				partyKitOrigin: c.env.PARTYKIT_ORIGIN,
			}).pipe(
				Effect.provideService(
					AuthContext,
					AuthContext.of({
						authUser: null,
					}),
				),
				Effect.provideService(
					Cloudflare,
					Cloudflare.of({
						env: c.env,
						request: c.req.raw,
						bindings: {
							KV: c.env.KV,
						},
					}),
				),
				Effect.provideService(
					ReplicacheContext,
					ReplicacheContext.of({
						spaceID,
						clientGroupID: body.clientGroupID,
						subspaceIDs: undefined,
					}),
				),
				Effect.scoped,
				Effect.orDie,
			);

			await Effect.runPromise(pushEffect);

			return c.json({}, 200);
		},
	);

export type Routes = typeof routes;
export default app;
