import type { WebBindings, WebEnv } from "~/types/env";

declare module "@remix-run/cloudflare" {
	interface AppLoadContext {
		cloudflare: {
			env: WebEnv;
			bindings: WebBindings;
		};
	}
}
