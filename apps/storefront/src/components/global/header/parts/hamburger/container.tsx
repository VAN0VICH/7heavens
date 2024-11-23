import type { Country } from "../../country-selector/country-selector-dialog";

import Hamburger from ".";
import type { Header } from "@/types/sanity.generated";

export default async function HamburgerContainer({
	sanityData,
}: {
	sanityData: Header;
}) {
	const countries: Country[] = [
		{
			code: "BY",
			currency: {
				code: "BYN",
				symbol: "Br",
			},
			name: "Belarus",
		},
	];

	return <Hamburger countries={countries} data={sanityData} />;
}
