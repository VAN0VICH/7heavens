"use client";

import Select from "@/components/shared/select";

import { useProductVariants } from "../product-context";
import type { ProductOption } from "@blazzing-app/validators/client";

type Props = {
	options: ProductOption[];
};

export default function OptionsSelect({ options }: Props) {
	const { selectedVariant, setVariant, setVariantOptions, variantOptions } =
		useProductVariants();

	return options?.map((option) => {
		const values = option.optionValues?.map(({ value }) => ({
			label: value,
			value: value.toLowerCase(),
		}));

		if (!values || values.length <= 1) return null;
		const setOption = (value: string) => {
			const newVariantOptions = {
				...variantOptions,
				[option.id]: value,
			};
			setVariantOptions(newVariantOptions);
			setVariant(newVariantOptions);
		};

		return (
			<Select
				className="w-fit"
				key={option.id}
				options={values}
				placeholder={variantOptions[option.id] ?? ""}
				setOption={setOption}
				variant="outline"
			/>
		);
	});
}
