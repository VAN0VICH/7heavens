import type { Header } from "@/types/sanity.generated";

import { Suspense } from "react";

import CartAddons from "./cart-addons";
import CartUI from "./cart-ui";
import { getEnrichedCart } from "@/data/medusa/cart";
import { getRegion } from "@/data/medusa/regions";

type Props = Pick<Header, "cartAddons">;

export default async function Cart({
	cartAddons,
	countryCode,
}: { countryCode: string } & Props) {
	const cart = await getEnrichedCart();

	const region = await getRegion(countryCode);
	console.log("cart addons", cartAddons);

	const addonIds = (cartAddons?.map(({ _ref }) => _ref) ?? []).filter(
		(id) => !cart?.items?.map(({ product_id }) => product_id)?.includes(id),
	);
	const addons =
		region && addonIds.length > 0 ? (
			<Suspense>
				<CartAddons ids={addonIds} region_id={region.id} />
			</Suspense>
		) : null;

	return <CartUI addons={addons} />;
}
