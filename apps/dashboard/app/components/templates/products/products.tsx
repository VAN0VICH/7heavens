import type {
	StoreOrder,
	StoreProduct,
	UpdateProduct,
} from "@blazzing-app/validators";
import { Box, Button, Flex, Grid, Heading, Skeleton } from "@radix-ui/themes";
import Image from "~/components/image";
import Price from "~/components/price";
import { cn } from "~/ui";
import { Icons } from "~/ui/icons";
import { toImageURL } from "~/utils/helpers";
import { Actions } from "../order/actions";
import React from "react";
import { useReplicache } from "~/zustand/replicache";
const Products = ({
	products,
	isInitialized,
	isOrderCreation = false,
	order,
}: {
	products: StoreProduct[];
	isInitialized?: boolean;
	isOrderCreation?: boolean;
	order?: StoreOrder;
}) => {
	if (!isInitialized)
		return (
			<Flex direction="column" gap="2" pt="2">
				<Flex gap="2" wrap="wrap">
					{[...Array(5)].map((_, index) => (
						<ProductSkeleton key={index} />
					))}
				</Flex>
			</Flex>
		);
	if (isInitialized && products.length === 0) {
		return (
			<Flex direction="column" align="center" justify="center" height="200px">
				<Heading size="4" className="text-center font-freeman " color="gray">
					Нет продуктов.
				</Heading>
			</Flex>
		);
	}
	return (
		<Flex direction="column" gap="2" className="p-0 w-full">
			<Flex gap="2" wrap="wrap">
				{products.map((product) => (
					<ProductComponent
						product={product}
						key={product.id}
						isOrderCreation={isOrderCreation}
						{...(order && { order })}
					/>
				))}
			</Flex>
		</Flex>
	);
};

const ProductComponent = ({
	product,
	isOrderCreation,
	order,
}: {
	product: StoreProduct;
	isOrderCreation?: boolean;
	order?: StoreOrder;
}) => {
	const rep = useReplicache((state) => state.dashboardRep);
	const [selectedVariantID, setSelectedVariantID] = React.useState<string>(
		product.baseVariantID,
	);
	const [isShaking, setIsShaking] = React.useState(false);

	const updateProduct = React.useCallback(
		async (available: UpdateProduct["updates"]["available"]) => {
			await rep?.mutate.updateProduct({
				id: product.id,
				updates: {
					available,
				},
			});
		},
		[rep, product.id],
	);

	const selectedVariant = React.useMemo(
		() =>
			product.variants.find((v) => v.id === selectedVariantID) ??
			product.baseVariant,
		[product, selectedVariantID],
	);

	return (
		<Box key={product.id} className=" break-inside-avoid">
			<Box className="group relative rounded-[7px] min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] aspect-square bg-accent-3">
				<Image
					src={
						product.baseVariant.thumbnail?.url ??
						toImageURL(
							product.baseVariant.thumbnail?.base64,
							product.baseVariant.thumbnail?.fileType,
						)
					}
					alt={product.baseVariant.thumbnail?.alt}
					className="w-full cursor-pointer aspect-square rounded-[7px] size-[200px]"
				/>
				<Box
					className={cn(
						"hidden md:flex absolute gap-2 rounded-[7px] cursor-pointer inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center",
					)}
				>
					{/* <Button
							onClick={(e) => {
								e.preventDefault();
							}}
						>
							Add to cart
						</Button> */}
				</Box>
				<Box
					position="absolute"
					top="2"
					right="2"
					className="scale-75 md:scale-90 lg:scale-100"
				>
					<Price
						amount={product.baseVariant?.prices?.[0]?.amount ?? -1}
						currencyCode="BYN"
						className="border rounded-[5px] font-bold max-h-[30px] flex items-center justify-center text-sm p-1 bg-accent-3 border-accent-9 text-accent-11"
					/>
				</Box>
			</Box>
			<Grid gap="2" pt="2">
				<Flex gap="2" align="center">
					<Heading
						size="3"
						className="overflow-hidden text-accent-11 text-ellipsis line-clamp-1"
					>
						{product.baseVariant.title}
					</Heading>
				</Flex>
				{isOrderCreation && order && (
					<Actions
						isShaking={isShaking}
						product={product}
						selectedVariant={selectedVariant}
						setVariantID={setSelectedVariantID}
						setIsShaking={setIsShaking}
						order={order}
						rep={rep}
					/>
				)}
				{!isOrderCreation &&
					(product.available ? (
						<Button
							variant="outline"
							color="red"
							onClick={async () => await updateProduct(false)}
						>
							<Icons.Lock className="size-4" />
							Заблокировать
						</Button>
					) : (
						<Button
							variant="outline"
							color="green"
							onClick={async () => await updateProduct(true)}
						>
							<Icons.Lock className="size-4" />
							Разблокировать
						</Button>
					))}
			</Grid>
		</Box>
	);
};

const ProductSkeleton = () => {
	// Generate a random height between 200px and 400px
	const randomHeight = Math.floor(Math.random() * (500 - 100 + 1)) + 100;

	return (
		<Box className="mb-4 break-inside-avoid">
			<Box className="relative group rounded-[7px]">
				<Skeleton
					className="w-full rounded-[7px]"
					style={{ height: `${randomHeight}px` }}
				/>
				<Box position="absolute" top="2" right="2">
					<Skeleton className="w-[60px] h-[30px] rounded-[5px]" />
				</Box>
			</Box>
			<Flex justify="between" gap="2" pt="2" align="center">
				<Flex gap="2" align="center">
					<Skeleton className="w-8 h-8 rounded-full" />
					<Skeleton className="w-[120px] h-[20px]" />
				</Flex>
				<Flex gap="2">
					<Skeleton className="w-8 h-8" />
				</Flex>
			</Flex>
		</Box>
	);
};
export { Products };
