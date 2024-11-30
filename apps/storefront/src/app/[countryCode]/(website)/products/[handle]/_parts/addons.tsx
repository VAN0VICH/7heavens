import type { Product } from "@/types/sanity.generated";

import { AddonsItem } from "@/components/shared/addons-item";
import Heading from "@/components/shared/typography/heading";
import { getProductsByHandles } from "@/data/blazzing-app/product-and-variant";
import { getCartId, getTempUserID } from "@/data/blazzing-app/cookies";

export async function Addons({ addons }: { addons: Product["addons"] }) {
	const cartID = await getCartId();
	const tempUserID = await getTempUserID();
	const handle = (addons?.products ?? [])
		.map(({ handle }) => handle)
		.filter(Boolean) as string[];

	if (!handle || handle.length === 0) return null;

	const products = await getProductsByHandles(handle);

	return (
		<div className="flex flex-col gap-xs rounded-lg bg-secondary p-s">
			<Heading desktopSize="lg" mobileSize="base" tag={"h4"}>
				{addons?.title}
			</Heading>
			{products.map((product) => (
				<AddonsItem
					key={product.id}
					product={product}
					cartID={cartID}
					tempUserID={tempUserID}
				/>
			))}
		</div>
	);
}
