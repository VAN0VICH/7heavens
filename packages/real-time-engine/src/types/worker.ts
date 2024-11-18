type WorkerBindings = {
	KV: KVNamespace;
};
type WorkerEnv = {
	WORKER_URL: string;
	WEB_URL: string;
	DATABASE_URL: string;
	PARTYKIT_ORIGIN: string;
	ENVIRONMENT: "development" | "production" | "staging";
	MEDUSA_BACKEND_URL: string;
	MEDUSA_PUBLISHABLE_KEY: string;
	SESSION_SECRET?: string;
};

export type { WorkerBindings, WorkerEnv };
