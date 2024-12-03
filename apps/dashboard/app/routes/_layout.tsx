import { getAuth } from "@clerk/remix/ssr.server";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { Outlet, redirect } from "@remix-run/react";

export const loader: LoaderFunction = async (args) => {
	const { userId } = await getAuth(args);

	if (!userId) {
		return redirect("/sign-in");
	}
	return Response.json({});
};

export default function DashboardLayout() {
	return <Outlet />;
}
