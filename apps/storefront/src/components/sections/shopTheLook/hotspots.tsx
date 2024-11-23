import type { ModularPageSection } from "../types";

import { cleanHandle } from "@/sanity/lib/utils";
import HotspotsUi from "./hotspots-ui";
import { getProductsByHandles } from "@/data/blazzing-app/product-and-variant";

export default async function Hotspots({
	image,
	productHotSpots,
}: Pick<
	ModularPageSection<"section.shopTheLook">,
	"countryCode" | "image" | "productHotSpots"
>) {
	const handles = productHotSpots
		?.map((hotSpot) => cleanHandle(hotSpot.handle))
		.filter((id): id is string => id !== undefined);

	if (!handles || handles.length === 0) return null;

	const products = await getProductsByHandles(handles);
	return (
		<HotspotsUi
			image={image}
			productHotSpots={productHotSpots}
			products={products}
		/>
	);
}
