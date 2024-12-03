import type { PageProps } from "@/types";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import Footer from "@/components/global/footer";
import { HeaderComponent } from "@/components/global/header";
import PreventBackNavigationSmoothScroll from "@/components/prevent-back-navigation-smooth-scroll";
import config from "@/config";
import { loadGlobalData } from "@/data/sanity";
import { getOgImages } from "@/data/sanity/resolve-sanity-route-metadata";
import { getCartId, getTempUserID } from "@/data/blazzing-app/cookies";

type LayoutProps = PropsWithChildren<
	Omit<PageProps<"countryCode">, "searchParams">
>;

export async function generateMetadata(): Promise<Metadata> {
	const data = await loadGlobalData();

	return {
		openGraph: {
			images: !data?.fallbackOGImage
				? undefined
				: getOgImages(data.fallbackOGImage),
			title: config.siteName,
		},
		title: config.siteName,
	};
}

export default async function Layout(props: LayoutProps) {
	const params = await props.params;

	const { children } = props;

	const data = await loadGlobalData();
	const cartID = await getCartId();
	const tempUserID = await getTempUserID();

	return (
		<>
			<PreventBackNavigationSmoothScroll />
			{data.header && (
				<HeaderComponent
					{...data.header}
					countryCode={params.countryCode}
					cartID={cartID}
					tempUserID={tempUserID}
				/>
			)}
			<main className="flex-1">{children}</main>
			{data.footer && <Footer {...data.footer} />}
		</>
	);
}
