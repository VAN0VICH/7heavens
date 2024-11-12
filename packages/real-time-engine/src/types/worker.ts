type WorkerBindings = {
	KV: KVNamespace;
};
type WorkerEnv = {
	WORKER_URL: string;
	WEB_URL: string;
	DATABASE_URL: string;
	PARTYKIT_ORIGIN: string;
	SESSION_SECRET?: string;
	ENVIRONMENT: "development" | "production" | "staging";
};

export type { WorkerBindings, WorkerEnv };
