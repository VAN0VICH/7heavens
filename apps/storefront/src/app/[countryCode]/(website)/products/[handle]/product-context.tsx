"use client";

import type { StoreProduct, StoreVariant } from "@blazzing-app/validators";
import type { PropsWithChildren } from "react";
import React, { createContext, useContext } from "react";

interface ProductVariantsContextType {
	selectedVariant: StoreVariant | undefined;
	variantOptions: Record<string, string>;
	setVariantOptions: (
		value: React.SetStateAction<Record<string, string>>,
	) => void;
	setVariant: (options: Record<string, string>) => void;
	isShaking: boolean;
	setIsShaking: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductVariantsContext = createContext<
	ProductVariantsContextType | undefined
>(undefined);

export function ProductVariantsProvider({
	children,
	product,
	handle,
	variant,
}: PropsWithChildren<{
	product: StoreProduct;
	handle: string;
	variant: StoreVariant;
}>) {
	const [isShaking, setIsShaking] = React.useState(false);
	const [selectedVariantHandle, setSelectedVariantHandle] =
		React.useState<string>(handle);

	const selectedVariant = React.useMemo(
		() =>
			(product.variants?.find((v) => v.handle === selectedVariantHandle) as
				| StoreVariant
				| undefined) ?? variant,
		[selectedVariantHandle, product, variant],
	);

	const [variantOptions, setVariantOptions] = React.useState<
		Record<string, string>
	>({});

	React.useEffect(() => {
		if (selectedVariant) {
			const variantOptions = (selectedVariant?.optionValues ?? []).reduce(
				(acc, curr) => {
					acc[curr.optionValue.optionID] = curr.optionValue.value;
					return acc;
				},
				{} as Record<string, string>,
			);
			setVariantOptions(variantOptions);
		} else {
			setVariantOptions({});
		}
	}, [selectedVariant]);

	const setVariant = React.useCallback(
		(options: Record<string, string>) => {
			if (Object.keys(options).length > 0) {
				let variantFound = false;
				for (const variant of product.variants ?? []) {
					let optionValuesEqual = true;
					if (variant.optionValues?.length === 0) optionValuesEqual = false;
					for (const value of variant.optionValues ?? []) {
						if (
							options[value.optionValue.optionID] !== value.optionValue.value
						) {
							optionValuesEqual = false;
						}
					}
					if (optionValuesEqual) {
						variantFound = true;
						setSelectedVariantHandle(variant.handle ?? "");
						break;
					}
				}
				//variant not found
				if (!variantFound) setSelectedVariantHandle(handle);
			}
		},
		[handle, product.variants],
	);

	return (
		<ProductVariantsContext.Provider
			value={{
				isShaking,
				setIsShaking,
				selectedVariant,
				setVariant,
				setVariantOptions,
				variantOptions,
			}}
		>
			{children}
		</ProductVariantsContext.Provider>
	);
}

export function useProductVariants() {
	const context = useContext(ProductVariantsContext);
	if (context === undefined) {
		throw new Error(
			"useProductVariants must be used within a ProductVariantsProvider",
		);
	}
	return context;
}
