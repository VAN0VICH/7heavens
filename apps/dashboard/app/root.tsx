import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";
import { GeneralErrorBoundary } from "./components/error-boundary";
import { Toploader } from "./components/top-loader";
// import { MobileSidebar, Sidebar } from "./components/layout/sidebar";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
// import { PartykitProvider } from "./client/partykit.client";
import { ClientOnly } from "remix-utils/client-only";
import { PartykitProvider } from "./client/partykit.client";
import { ClientHintCheck, getHints } from "./hooks/use-hints";
import { useNonce } from "./hooks/use-nonce";
import { DashboardReplicacheProvider } from "./providers/replicache/storefront-dashboard";
import { userContext } from "./server/sessions.server";
import sonnerStyles from "./sonner.css?url";
import "./tailwind.css";
import type { Preferences } from "./types/state";
import { Toaster } from "./ui/toaster";
import { getDomainUrl } from "./utils/helpers";
import vaulStyles from "./vaul.css?url";
import { DashboardStoreProvider } from "./zustand/store";
import { DashboardStoreMutator } from "./zustand/store-mutator";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { ClerkApp } from "@clerk/remix";
export const links: LinksFunction = () => {
	return [
		// Preload svg sprite as a resource to avoid render blocking
		//TODO: ADD ICON
		{ rel: "stylesheet", href: sonnerStyles },
		{ rel: "stylesheet", href: vaulStyles },
	].filter(Boolean);
};
export type RootLoaderData = {
	ENV: Env;
	requestInfo: {
		hints: ReturnType<typeof getHints>;
		origin: string;
		path: string;
	};
};

export const loader: LoaderFunction = async (args) => {
	return rootAuthLoader(args, async ({ request, context: { cloudflare } }) => {
		const {
			REPLICACHE_KEY,
			PARTYKIT_HOST,
			BLAZZING_URL,
			BLAZZING_PUBLISHABLE_KEY,
		} = cloudflare.env;

		const cookieHeader = request.headers.get("Cookie");
		const userContextCookie = (await userContext.parse(cookieHeader)) || {};
		return {
			ENV: {
				REPLICACHE_KEY,
				PARTYKIT_HOST,
				BLAZZING_URL,
				BLAZZING_PUBLISHABLE_KEY,
			},

			requestInfo: {
				hints: getHints(request),
				origin: getDomainUrl(request),
				path: new URL(request.url).pathname,
				userContext: {
					cartID: userContextCookie.cartID,
				},
			},
		};
	});
};

function App() {
	const data = useLoaderData<RootLoaderData>();
	const nonce = useNonce();
	return (
		<Document nonce={nonce} env={data.ENV} theme={"light"}>
			<DashboardReplicacheProvider>
				<DashboardStoreProvider>
					<DashboardStoreMutator>
						<Theme
							accentColor={"orange"}
							grayColor={"sand"}
							radius="small"
							panelBackground="solid"
							appearance={"light"}
						>
							<Toploader />
							<Outlet />
							<Toaster />

							<ClientOnly>{() => <PartykitProvider />}</ClientOnly>
						</Theme>
					</DashboardStoreMutator>
				</DashboardStoreProvider>
			</DashboardReplicacheProvider>
		</Document>
	);
}

export default ClerkApp(App);

function Document({
	children,
	nonce,
	env = {},
	allowIndexing = true,
	theme,
}: {
	children: React.ReactNode;
	nonce: string;
	env?: Record<string, string>;
	allowIndexing?: boolean;
	theme: Preferences["theme"];
}) {
	return (
		<html lang="en" className={theme}>
			<head>
				<ClientHintCheck nonce={nonce} />
				{/* <link rel="icon" href="/assets/Logo.png" type="image/png" /> */}
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{allowIndexing ? null : (
					<meta name="robots" content="noindex, nofollow" />
				)}
				<Meta />
				<Links />
			</head>

			<body className="min-w-[280px]">
				{children}
				<ScrollRestoration nonce={nonce} />
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(env)}`,
					}}
				/>
				<Scripts nonce={nonce} />
			</body>
		</html>
	);
}
export function ErrorBoundary() {
	// the nonce doesn't rely on the loader so we can access that
	const nonce = useNonce();

	// NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
	// likely failed to run so we have to do the best we can.
	// We could probably do better than this (it's possible the loader did run).
	// This would require a change in Remix.

	// Just make sure your root route never errors out and you'll always be able
	// to give the user a better UX.

	return (
		<Document nonce={nonce} theme={"light"}>
			<GeneralErrorBoundary />
		</Document>
	);
}
