import type { Routes } from "@blazzing-app/functions";
import { StorefrontDashboardMutators } from "@blazzing-app/replicache";
import { useAuth } from "@clerk/remix";
import { hc } from "hono/client";
import { useEffect } from "react";
import { Replicache } from "replicache";
import { useReplicache } from "~/zustand/replicache";

function DashboardReplicacheProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const dashboardRep = useReplicache((state) => state.dashboardRep);
	const setDashboardRep = useReplicache((state) => state.setDashboardRep);
	const { getToken } = useAuth();

	useEffect(() => {
		if (dashboardRep) {
			return;
		}
		//@ts-ignore
		const client = hc<Routes>(window.ENV.BLAZZING_URL);

		const r = new Replicache({
			name: "storefront-dashboard",
			licenseKey: window.ENV.REPLICACHE_KEY,
			mutators: StorefrontDashboardMutators,
			pullInterval: null,

			//@ts-ignore
			puller: async (req) => {
				const token = await getToken();
				const response = await client.replicache.pull.$post(
					{
						//@ts-ignore
						json: req,
						query: {
							spaceID: "storefront-dashboard" as const,
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
					response: response.status === 200 ? await response.json() : undefined,
					httpRequestInfo: {
						httpStatusCode: response.status,
						errorMessage: response.status === 200 ? "" : response.statusText,
					},
				};
			},
			pusher: async (req) => {
				const token = await getToken();
				const response = await client.replicache.push.$post(
					{
						//@ts-ignore
						json: req,
						query: {
							spaceID: "storefront-dashboard" as const,
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
					httpRequestInfo: {
						httpStatusCode: response.status,
						errorMessage: response.status === 200 ? "" : response.statusText,
					},
				};
			},
		});
		setDashboardRep(r);
	}, [dashboardRep, setDashboardRep, getToken]);
	return <>{children}</>;
}

export { DashboardReplicacheProvider };
