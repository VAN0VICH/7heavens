import { z } from "zod";

const WebEnvSchema = z.object({
	WORKER_URL: z.string(),
	REPLICACHE_KEY: z.string(),
	ENVIRONMENT: z.enum(["production", "staging", "development"]),
	PARTYKIT_HOST: z.string().optional(),
	HONEYPOT_SECRET: z.string().optional(),
	SESSION_SECRET: z.string().optional(),
});

type WebEnv = z.infer<typeof WebEnvSchema>;
type WebBindings = { KV: KVNamespace };
export { WebEnvSchema };
export type { WebEnv, WebBindings };
