import type { HttpTypes } from "@medusajs/types";

import medusaError from "@/utils/medusa/error";

import client from "./client";

export const listRegions = async () => {
	"use cache";

	return client.store.region
		.list({}, { next: { tags: ["regions"] } })
		.then(({ regions }) => regions)
		.catch(medusaError);
};

export const listCountries = async () => {
	"use cache";
	const regions = await listRegions();
	const countries = regions.flatMap((region) =>
		region.countries?.map((country) => ({
			code: country.iso_2,
			currency: {
				code: region.currency_code,
				symbol: new Intl.NumberFormat("en-US", {
					currency: region.currency_code,
					style: "currency",
				})
					.format(9)
					.split("9")[0],
			},
			name: country.display_name,
		})),
	);

	return countries.filter(
		(country, index, self) =>
			index === self.findIndex((t) => t?.code === country?.code),
	);
};

const regionMap = new Map<string, HttpTypes.StoreRegion>();

export const getRegion = async (countryCode: string) => {
	"use cache";
	try {
		if (regionMap.has(countryCode)) {
			return regionMap.get(countryCode);
		}

		const regions = await listRegions();

		if (!regions) {
			return null;
		}

		// biome-ignore lint/complexity/noForEach: <explanation>
		regions.forEach((region) => {
			if (region.countries) {
				for (const c of region.countries) {
					regionMap.set(c?.iso_2 ?? "", region);
				}
			}
		});

		const region = countryCode
			? regionMap.get(countryCode)
			: regionMap.get("us");

		return region;
	} catch (e: any) {
		return null;
	}
};
