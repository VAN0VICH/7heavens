"use client";
import { env } from "@/app/env";
import { useReplicache } from "@/zustand/replicache";
import { type Routes, StoreMutators } from "@7heavens/real-time-engine";
import { hc } from "hono/client";
import React from "react";
import { Replicache } from "replicache";

export function StoreReplicacheProvider({
	children,
	cartId,
}: Readonly<{
	children: React.ReactNode;
	cartId: string | undefined;
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
			mutators: StoreMutators,
			pullInterval: null,
			//@ts-ignore
			puller: async (req) => {
				const response = await client.pull.$post(
					{
						//@ts-ignore
						json: req,
						query: {
							spaceID: "store" as const,
						},
					},
					{
						headers: {
							"Content-Type": "application/json",
							...(cartId && { "x-cart-id": cartId }),
						},
					},
				);

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
	}, [rep, setRep, cartId]);

	return <>{children}</>;
}
