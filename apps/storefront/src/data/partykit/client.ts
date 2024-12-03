"use client";

import { useReplicache } from "@/zustand/replicache";
import type { Routes } from "@blazzing-app/functions";
import { hc } from "hono/client";
import usePartySocket from "partysocket/react";

function PartykitProvider({
	cartID,
	tempUserID,
}: { cartID: string | undefined; tempUserID: string | undefined }) {
	const globalRep = useReplicache((state) => state.storeRep);
	//@ts-ignore
	const client = hc<Routes>(
		process.env.NEXT_PUBLIC_BLAZZING_APP_WORKER_URL ?? "",
	);

	usePartySocket({
		// usePartySocket takes the same arguments as PartySocket.
		host: process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? "", // or localhost:1999 in dev
		room: "storefront",

		// in addition, you can provide socket lifecycle event handlers
		// (equivalent to using ws.addEventListener in an effect hook)
		onOpen() {
			console.log("connected");
		},
		onMessage(e) {
			const subspaces = JSON.parse(e.data) as string[];
			console.log("message", subspaces);
			if (globalRep) {
				//@ts-ignore
				globalRep.puller = async (req) => {
					const response = await client.replicache.pull.$post(
						{
							//@ts-ignore
							json: req,
							query: {
								spaceID: "storefront" as const,
								subspaces,
							},
						},
						{
							headers: {
								"x-publishable-key":
									process.env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
								...(cartID && { "x-cart-id": cartID }),
								...(tempUserID && { "x-temp-user-id": tempUserID }),
							},
						},
					);

					return {
						response:
							response.status === 200 ? await response.json() : undefined,
						httpRequestInfo: {
							httpStatusCode: response.status,
							errorMessage: response.status === 200 ? "" : response.statusText,
						},
					};
				};
				globalRep.pull();
			}
		},
		onClose() {
			console.log("closed");
		},
		onError() {
			console.log("error");
		},
	});

	return null;
}
export { PartykitProvider };
