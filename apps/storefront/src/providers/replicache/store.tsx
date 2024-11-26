"use client";
import { env } from "@/app/env";
import { useReplicache } from "@/zustand/replicache";
import type { Routes } from "@blazzing-app/functions";
import { StorefrontMutators } from "@blazzing-app/replicache";
import { hc } from "hono/client";
import React from "react";
import { Replicache } from "replicache";

export function StoreReplicacheProvider({
	children,
	cartID,
}: Readonly<{
	children: React.ReactNode;
	cartID: string | undefined;
}>) {
	const rep = useReplicache((state) => state.storeRep);
	const setRep = useReplicache((state) => state.setStoreRep);

	React.useEffect(() => {
		if (rep) {
			return;
		}

		const client = hc<Routes>(env.NEXT_PUBLIC_BLAZZING_APP_WORKER_URL);

		const r = new Replicache({
			name: "store",
			licenseKey: env.NEXT_PUBLIC_REPLICACHE_KEY,
			pullInterval: null,
			mutators: StorefrontMutators,
			//@ts-ignore
			puller: async (req) => {
				const response = await client.replicache.pull.$post(
					{
						//@ts-ignore
						json: req,
						query: {
							spaceID: "storefront" as const,
						},
					},
					{
						headers: {
							"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
							...(cartID && { "x-cart-id": cartID }),
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
				const response = await client.replicache.push.$post(
					{
						//@ts-ignore
						json: req,
						query: {
							spaceID: "storefront" as const,
						},
					},
					{
						headers: {
							"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
						},
					},
				);
				return {
					httpRequestInfo: {
						httpStatusCode: response.status,
						errorMessage: response.status === 200 ? "" : response.statusText,
					},
				};
			},
		});
		setRep(r);
	}, [rep, setRep, cartID]);

	return <>{children}</>;
}
