import type { StoreLineItem as LineItemType } from "@blazzing-app/validators";
import {
	Badge,
	Box,
	Button,
	Card,
	Flex,
	Grid,
	Heading,
	IconButton,
	Skeleton,
	Text,
} from "@radix-ui/themes";
import React from "react";
import Image from "~/components/image";
import Price from "~/components/price";
import { Icons } from "~/ui/icons";
import { decapitalize } from "~/utils/helpers";

export const LineItem = ({
	lineItem,
	deleteItem,
	updateItem,
	currencyCode,
	readonly = false,
}: {
	lineItem: LineItemType;
	deleteItem?: (id: string) => Promise<void>;
	updateItem?: (id: string, quantity: number) => Promise<void>;
	currencyCode: string;
	readonly?: boolean;
}) => {
	const reduceQuantity = React.useCallback(async () => {
		if (lineItem.quantity === 1) return await deleteItem?.(lineItem.id);
		await updateItem?.(lineItem.id, lineItem.quantity - 1);
	}, [deleteItem, updateItem, lineItem]);

	const increaseQuantity = React.useCallback(async () => {
		await updateItem?.(lineItem.id, lineItem.quantity + 1);
	}, [updateItem, lineItem]);

	return (
		<Card className="gap-2 flex w-full items-center p-2 rounded-[4px]">
			<Image
				src={
					lineItem.variant.thumbnail?.url ??
					lineItem.product?.baseVariant?.thumbnail?.url
				}
				className="rounded-[4px] aspect-square"
				quality={100}
				// fallback={<ImagePlaceholder />}
				width={{ initial: 80 }}
				height={{ initial: 80 }}
			/>
			<Flex justify="between" gap="2" width="100%">
				<Flex justify="between" direction="column" gap="1">
					<Heading size="3" className="text-accent-11">
						{lineItem.title}
					</Heading>
					<Box>
						{lineItem.variant?.optionValues?.map((v) => (
							<Flex key={v.optionValue.id} gap="1">
								<Text size="2" weight="medium">
									{decapitalize(v.optionValue?.option?.name ?? "")}:
								</Text>
								<Badge size="1" variant="surface">
									{v.optionValue.value}
								</Badge>
							</Flex>
						))}
					</Box>
					<Flex align="center">
						{readonly ? (
							<Flex gap="2">
								<Text>количество:</Text>
								<Text weight="bold" size="3">
									{lineItem.quantity}
								</Text>
							</Flex>
						) : (
							<>
								<IconButton
									variant="soft"
									disabled={lineItem.quantity === 0}
									onClick={reduceQuantity}
									size="2"
								>
									<Icons.Minus className="size-4" />
								</IconButton>
								<Text size="4" className="px-3 text-accent-11">
									{lineItem.quantity}
								</Text>
								<IconButton
									onClick={increaseQuantity}
									variant="soft"
									type="button"
									size="2"
								>
									<Icons.Plus className="size-4" />
								</IconButton>
							</>
						)}
					</Flex>
				</Flex>
				<Flex
					direction="column"
					align="end"
					position="relative"
					className="min-h-[80px]"
				>
					<Price
						amount={lineItem.variant.prices?.[0]?.amount ?? -1}
						currencyCode={currencyCode}
						className="font-bold text-accent-11 border p-1 rounded-[5px] bg-accent-2 border-accent-9"
					/>
					{!readonly && (
						<IconButton
							type="button"
							variant="soft"
							size="2"
							className="absolute bottom-0 right-0"
							onClick={async () => await deleteItem?.(lineItem.id)}
						>
							<Icons.Trash className="size-4" />
						</IconButton>
					)}
				</Flex>
			</Flex>
		</Card>
	);
};
export const LineItemSkeleton = () => {
	return (
		<Flex className="w-full flex gap-2">
			<Card className="aspect-square border-none flex items-center justify-center p-0 rounded-lg relative w-[100px]">
				<Skeleton className="w-[100px] h-[100px] rounded-lg" />
			</Card>
			<Flex gap="2" justify="between">
				<Flex direction="column" justify="between" gap="2">
					<Skeleton className="w-[150px] h-[10px]" />
					<Grid gap="2">
						<Skeleton className="w-[150px] h-[10px]" />
						<Skeleton className="w-[150px] h-[10px]" />
					</Grid>
					<Flex align="center">
						<Button variant="ghost" type="button">
							<Icons.Minus size={10} />
						</Button>
						<Skeleton className="w-[15px] h-[15px] mx-2" />
						<Button type="button" variant="ghost">
							<Icons.Plus size={10} />
						</Button>
					</Flex>
				</Flex>
				<Flex direction="column" align="end" justify="between">
					<Skeleton className="w-[50px] h-[10px]" />
					<Button variant="outline" type="button">
						<Icons.Trash size={12} />
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};
