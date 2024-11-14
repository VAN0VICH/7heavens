import { getProductsByHandles } from "@/data/medusa/products";
import { getRegion } from "@/data/medusa/regions";

import type { ModularPageSection } from "../types";

import { cleanHandle } from "@/sanity/lib/utils";
import HotspotsUi from "./hotspots-ui";

export default async function Hotspots({
	countryCode,
	image,
	productHotSpots,
}: Pick<
	ModularPageSection<"section.shopTheLook">,
	"countryCode" | "image" | "productHotSpots"
>) {
	const region = await getRegion(countryCode);

	if (!region) {
		console.log("region", region);
		console.log("countryCode", countryCode);
		console.log("No region found");
		return null;
	}

	const handles = productHotSpots
		?.map((hotSpot) => cleanHandle(hotSpot.handle))
		.filter((id): id is string => id !== undefined);

	if (!handles || handles.length === 0) return null;

	const products = await getProductsByHandles(handles, region.id);
	return (
		<HotspotsUi
			image={image}
			productHotSpots={productHotSpots}
			products={products}
		/>
	);
}
