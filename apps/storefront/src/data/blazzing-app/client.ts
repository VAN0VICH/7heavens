import type { Routes } from "@blazzing-app/functions";
import { hc } from "hono/client";

//@ts-ignore
const client = hc<Routes>(
	process.env.NEXT_PUBLIC_BLAZZING_APP_WORKER_URL ?? "",
);

export { client };
