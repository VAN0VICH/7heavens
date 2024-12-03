import type { StorefrontDashboardMutatorsType } from "@blazzing-app/replicache";
import { generateID } from "@blazzing-app/utils";
import type {
	CreateLineItem,
	StoreOrder,
	StoreProduct,
	StoreVariant,
	Variant,
} from "@blazzing-app/validators";
import { Button, Flex, Grid, Text } from "@radix-ui/themes";
import React from "react";
import type { Replicache } from "replicache";
import { translation } from "~/constants";
import { cn } from "~/ui";
import { Icons } from "~/ui/icons";
import { ToggleGroup, ToggleGroupItem } from "~/ui/toggle-group";
type Props = {
	product: StoreProduct;
	selectedVariant: Variant | undefined;
	isShaking: boolean;
	setIsShaking: React.Dispatch<React.SetStateAction<boolean>>;
	setVariantID: (prop: string) => void;
	order: StoreOrder;
	rep: Replicache<StorefrontDashboardMutatorsType> | null;
};
export const Actions = (props: Props) => {
	return (
		<Grid gap="2">
			<ProductOptions {...props} />
			<AddToOrder {...props} />
		</Grid>
	);
};

const AddToOrder = ({
	order,
	selectedVariant,
	product,
	setIsShaking,
	rep,
}: Props) => {
	const itemsIDs = React.useMemo(
		() => new Map((order.items ?? []).map((i) => [i.variantID, i])),
		[order.items],
	);
	const addToOrder = React.useCallback(
		async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			e.stopPropagation();

			if (
				!selectedVariant ||
				(product.variants.length > 1 && !selectedVariant) ||
				(product.variants.length > 1 &&
					selectedVariant.id === product.baseVariantID)
			) {
				setIsShaking(true);
				setTimeout(setIsShaking, 250);

				return;
			}

			const item = itemsIDs.get(selectedVariant.id);
			if (item) {
				return await rep?.mutate.updateLineItem({
					id: item.id,
					quantity: item.quantity + 1,
				});
			}
			const newID = generateID({ prefix: "line_item" });
			const newLineItem: CreateLineItem["lineItem"] = {
				id: newID,
				orderID: order.id,
				title: selectedVariant.title ?? "",
				quantity: 1,
				createdAt: new Date().toISOString(),
				//@ts-ignore
				variant: selectedVariant as StoreVariant,
				variantID: selectedVariant.id,
				productID: selectedVariant.productID,
				product,
				storeID: product.storeID ?? "",
			};

			await rep?.mutate.createLineItem({
				lineItem: newLineItem,
			});
		},
		[order, selectedVariant, rep, itemsIDs, product, setIsShaking],
	);
	return (
		<Button variant="surface" color="orange" onClick={addToOrder}>
			<Icons.Plus className="size-4" />
			Добавить
		</Button>
	);
};

const ProductOptions = ({
	isShaking,
	selectedVariant,
	setVariantID,
	product,
}: Props) => {
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
				for (const variant of product.variants) {
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
						setVariantID(variant.id);
						break;
					}
				}
				//variant not found
				if (!variantFound)
					product.baseVariantID && setVariantID(product.baseVariantID);
			}
		},
		[product.variants, setVariantID, product.baseVariantID],
	);
	if (product.options.length === 0) return null;
	return (
		<Grid columns="2">
			{product.options.map((option) => {
				return (
					<Flex direction="column" key={option.id}>
						<Text className="flex min-w-[4rem] items-center pb-2 text-sm">
							{option.name
								? translation[option.name as keyof typeof translation]
								: ""}{" "}
							:
						</Text>
						<ToggleGroup
							className={cn(
								"flex justify-start",
								isShaking && "animate-shake duration-300",
							)}
							type="single"
							value={variantOptions[option.id] ?? ""}
							onValueChange={async (value) => {
								const newVariantOptions = {
									...variantOptions,
									[option.id]: value,
								};
								setVariantOptions(newVariantOptions);
								setVariant(newVariantOptions);
							}}
							onClick={(e) => e.stopPropagation()}
						>
							{option.optionValues?.map((val) => {
								const variant = product.variants.find((variant) => {
									return variant.optionValues?.some(
										(v) => v.optionValue.id === val.id,
									);
								});
								const isInStock = variant ? variant.quantity > 0 : false;
								return (
									<ToggleGroupItem
										key={val.id}
										value={val.value}
										disabled={!isInStock}
									>
										{val.value}
									</ToggleGroupItem>
								);
							})}
						</ToggleGroup>
					</Flex>
				);
			})}
		</Grid>
	);
};
