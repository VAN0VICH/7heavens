import type { Metadata } from "next";

import config from "@/config";

import { Studio } from "./studio";

export const metadata: Metadata = {
	title: `${config.siteName} - CMS`,
};

export default function StudioPage() {
	return (
		<body>
			{/* <StoreReplicacheProvider>
				<CartProvider countryCode={"by"}>
					<GlobalStoreProvider>
						<GlobalStoreMutator>
							<PartykitProvider /> */}
			<Studio />
			{/* </GlobalStoreMutator>
					</GlobalStoreProvider>
				</CartProvider>
			</StoreReplicacheProvider> */}
		</body>
	);
}
