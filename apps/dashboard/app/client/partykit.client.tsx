import type { Routes } from "@blazzing-app/functions";
import { useAuth } from "@clerk/remix";
import { hc } from "hono/client";
import usePartySocket from "partysocket/react";

import { useReplicache } from "~/zustand/replicache";

function PartykitProvider() {
	const dashboardRep = useReplicache((state) => state.dashboardRep);
	//@ts-ignore
	const client = hc<Routes>(window.ENV.BLAZZING_URL);
	const { getToken } = useAuth();

	usePartySocket({
		// usePartySocket takes the same arguments as PartySocket.
		host: window.ENV.PARTYKIT_HOST, // or localhost:1999 in dev
		room: "storefront-dashboard",

		// in addition, you can provide socket lifecycle event handlers
		// (equivalent to using ws.addEventListener in an effect hook)
		onOpen() {
			console.log("connected");
		},
		async onMessage(e) {
			const subspaces = JSON.parse(e.data) as string[];
			const token = await getToken();
			console.log("message", subspaces);
			if (dashboardRep) {
				//@ts-ignore
				dashboardRep.puller = async (req) => {
					const response = await client.replicache.pull.$post(
						{
							//@ts-ignore
							json: req,
							query: {
								spaceID: "storefront-dashboard" as const,
								subspaces,
							},
						},
						{
							headers: {
								...(token && { Authorization: `Bearer ${token}` }),
								"Content-Type": "application/json",
								"x-publishable-key": window.ENV.BLAZZING_PUBLISHABLE_KEY,
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
				dashboardRep.pull();
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
