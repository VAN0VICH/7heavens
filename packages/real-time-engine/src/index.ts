import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import type { WorkerBindings, WorkerEnv } from "./types/worker";

const app = new Hono<{ Bindings: WorkerBindings & WorkerEnv }>();

app
	.use(logger())
	.use("*", async (c, next) => {
		const wrapped = cors({
			origin:
				c.env.ENVIRONMENT === "production"
					? "https://blazzing.app"
					: [
							"http://localhost:5173",
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

const routes = app.post("/hello", (c) => {
	return c.text("hello");
});

export type Routes = typeof routes;
export default app;
