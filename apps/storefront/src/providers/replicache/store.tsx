"use client";
import { env } from "@/app/env";
import { useReplicache } from "@/zustand/replicache";
import type { Routes } from "@7heavens/real-time-engine";
import { hc } from "hono/client";
import React from "react";
import { Replicache } from "replicache";

export function StoreReplicacheProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const rep = useReplicache((state) => state.storeRep);
	const setRep = useReplicache((state) => state.setStoreRep);

	React.useEffect(() => {
		if (rep) {
			return;
		}

		const client = hc<Routes>(env.NEXT_PUBLIC_REAL_TIME_ENGINE_URL);

		//@ts-ignore
		const r = new Replicache({
			name: "store",
			licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
			pullInterval: null,
			//@ts-ignore
			puller: async (req) => {
				const response = await client.pull.$post({
					//@ts-ignore
					json: req,
					query: {
						spaceID: "store" as const,
					},
				});

				return {
					response: response.status === 200 ? await response.json() : undefined,
					httpRequestInfo: {
						httpStatusCode: response.status,
						errorMessage: response.status === 200 ? "" : response.statusText,
					},
				};
			},
			pusher: async (req) => {
				const response = await client.push.$post({
					//@ts-ignore
					json: req,
					query: {
						spaceID: "store" as const,
					},
				});
				return {
					httpRequestInfo: {
						httpStatusCode: response.status,
						errorMessage: response.status === 200 ? "" : response.statusText,
					},
				};
			},
		});
		setRep(r);
	}, [rep, setRep]);

	return <>{children}</>;
}
