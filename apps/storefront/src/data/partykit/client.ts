"use client";

import { env } from "@/app/env";
import { useReplicache } from "@/zustand/replicache";
import type { Routes } from "@7heavens/real-time-engine";
import { hc } from "hono/client";
import usePartySocket from "partysocket/react";

function PartykitProvider() {
	const globalRep = useReplicache((state) => state.storeRep);
	const client = hc<Routes>(env.NEXT_PUBLIC_REAL_TIME_ENGINE_URL);

	usePartySocket({
		// usePartySocket takes the same arguments as PartySocket.
		host: env.NEXT_PUBLIC_PARTYKIT_HOST, // or localhost:1999 in dev
		room: "store",

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
					const response = await client.pull.$post({
						//@ts-ignore
						json: req,
						query: {
							spaceID: "store" as const,
							subspaces,
						},
					});

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
