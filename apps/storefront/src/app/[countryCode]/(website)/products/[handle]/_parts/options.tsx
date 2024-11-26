"use client";

import Select from "@/components/shared/select";

import { useProductVariants } from "../product-context";
import type { StoreProductOption } from "@blazzing-app/validators";
import { cn } from "@/utils/cn";

type Props = {
	options: StoreProductOption[];
};

export default function OptionsSelect({ options }: Props) {
	const { setVariant, setVariantOptions, variantOptions, isShaking } =
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
				className={cn("w-fit", isShaking && "animate-shake duration-300")}
				key={option.id}
				options={values}
				placeholder={
					option.name === "size" ? "Выберите размер" : "Выберите опцию"
				}
				setOption={setOption}
				variant="outline"
			/>
		);
	});
}
