import type { PageProps } from "@/types";
import type { PropsWithChildren } from "react";

import { CountryCodeProvider } from "@/components/context/country-code-context";
import { ExitPreview } from "@/components/exit-preview";
import { CartProvider } from "@/components/global/header/cart/cart-context";
import { PartykitProvider } from "@/data/partykit/client";
import { StoreReplicacheProvider } from "@/providers/replicache/store";
import { GlobalStoreMutator } from "@/zustand/store-mutator";
import { Analytics } from "@vercel/analytics/react";
import VisualEditing from "next-sanity/visual-editing/client-component";
import cache from "next/cache";
import { draftMode } from "next/headers";
import { getCartId, getTempUserID } from "@/data/blazzing-app/cookies";

type LayoutProps = PropsWithChildren<
	Omit<PageProps<"countryCode">, "searchParams">
>;

export default async function Layout(props: LayoutProps) {
	const params = await props.params;
	const { children } = props;
	const cartID = await getCartId();
	const tempUserID = await getTempUserID();

	const shouldEnableDraftModeToggle =
		process.env.NODE_ENV === "development" && (await draftMode()).isEnabled;
	return (
		<CountryCodeProvider countryCode={params.countryCode}>
			<StoreReplicacheProvider cartID={cartID} tempUserID={tempUserID}>
				<GlobalStoreMutator>
					<CartProvider countryCode={params.countryCode} cartID={cartID}>
						<PartykitProvider cartID={cartID} tempUserID={tempUserID} />

						<body className="scrollbar-hide relative flex min-h-screen min-w-min-screen flex-col overflow-x-clip">
							{children}
							{(await draftMode()).isEnabled && (
								<VisualEditing
									refresh={async (payload) => {
										"use server";
										if (!(await draftMode()).isEnabled) {
											console.debug(
												"Skipped manual refresh because draft mode is not enabled",
											);
											return;
										}
										if (payload.source === "mutation") {
											if (payload.document.slug?.current) {
												const tag = `${payload.document._type}:${payload.document.slug.current}`;
												console.log("Revalidate slug", tag);
												await cache.revalidateTag(tag);
											}
											console.log("Revalidate tag", payload.document._type);
											return cache.revalidateTag(payload.document._type);
										}
										await cache.revalidatePath("/", "layout");
									}}
								/>
							)}
							{shouldEnableDraftModeToggle && (
								<ExitPreview enable={(await draftMode()).isEnabled} />
							)}
							<Analytics />
						</body>
					</CartProvider>
				</GlobalStoreMutator>
			</StoreReplicacheProvider>
		</CountryCodeProvider>
	);
}
