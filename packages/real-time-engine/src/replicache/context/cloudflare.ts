import { Context } from "effect";
import type { WorkerBindings, WorkerEnv } from "../../types/worker";

class Cloudflare extends Context.Tag("Cloudflare")<
	Cloudflare,
	{
		readonly env: WorkerEnv;
		readonly bindings: WorkerBindings;
		readonly request: Request;
	}
>() {}

export { Cloudflare };
