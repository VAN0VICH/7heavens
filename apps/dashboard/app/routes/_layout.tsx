import type { LoaderFunction } from "@remix-run/cloudflare";
import { Outlet, redirect } from "@remix-run/react";

export const loader: LoaderFunction = async (args) => {
	const { context } = args;
	const { authUser } = context;

	if (!authUser) {
		return redirect("/login");
	}
	return Response.json(authUser);
};

export default function DashboardLayout() {
	return <Outlet />;
}
