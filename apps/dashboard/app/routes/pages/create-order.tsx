import { generateID } from "@blazzing-app/utils";
import type {
	InsertOrder,
	StoreOrder,
	StoreProduct,
} from "@blazzing-app/validators";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import {
	Badge,
	Box,
	Button,
	Dialog,
	Flex,
	Grid,
	Heading,
	IconButton,
	ScrollArea,
	Select,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useDebounce } from "@uidotdev/usehooks";
import { AnimatePresence } from "framer-motion";
import React from "react";
import { Total } from "~/components/info/total";
import {
	LineItem,
	LineItemSkeleton,
} from "~/components/templates/line-item/line-item";
import { Products } from "~/components/templates/products/products";
import { collectionHandles, translation } from "~/constants";
import { cn } from "~/ui";
import { Icons } from "~/ui/icons";
import { toast } from "~/ui/toast";
import type {
	SearchWorkerRequest,
	SearchWorkerResponse,
} from "~/worker/search";
import { useReplicache } from "~/zustand/replicache";
import { useDashboardStore } from "~/zustand/store";
type Props = {
	draftOrderID: string | undefined;
	setDraftOrderID: (id: string | undefined) => void;
	draftPageOpened: boolean;
	setDraftPageOpened: React.Dispatch<React.SetStateAction<boolean>>;
	step: number;
	setStep: React.Dispatch<React.SetStateAction<number>>;
};
export const DraftOrderPage = ({
	draftOrderID,
	draftPageOpened,
	setDraftOrderID,
	setDraftPageOpened,
	step,
	setStep,
}: Props) => {
	const rep = useReplicache((state) => state.dashboardRep);
	const [type, setType] = React.useState<"onsite" | "takeout">("onsite");
	const draftOrderMap = useDashboardStore((state) => state.draftOrderMap);
	const draftOrder = draftOrderMap.get(draftOrderID ?? "");
	const [tableNumber, setTableNumber] = React.useState<number | "">("");
	const [paymentStatus, setPaymentStatus] =
		React.useState<StoreOrder["paymentStatus"]>("not_paid");
	const orderDisplayID = useDashboardStore((state) => state.orderDisplayID);
	const store = useDashboardStore((state) => state.stores)[0];
	const createNewOrder = React.useCallback(async () => {
		if (store && rep) {
			const newOrder: InsertOrder = {
				id: generateID({ prefix: "draft_order" }),
				countryCode: "BY",
				currencyCode: "BYN",
				displayId: JSON.stringify(orderDisplayID + 1),
				createdAt: new Date().toISOString(),
				type,
				storeID: store.id,
				status: "pending",
				total: 0,
				subtotal: 0,
				paymentStatus: "not_paid",
			};
			await rep.mutate.createOrder({
				order: newOrder,
			});
			setDraftOrderID(newOrder.id);
		}
	}, [orderDisplayID, store, type, rep, setDraftOrderID]);
	const completeOrder = React.useCallback(async () => {
		if (draftOrderID) {
			await rep?.mutate.updateOrder({
				id: draftOrderID,
				updates: {
					id: draftOrderID.replace("draft_", ""),
					...(tableNumber && { tableNumber: tableNumber }),
					paymentStatus,
				},
			});
			toast.success("Заказ оформлен!");
			setDraftPageOpened(false);
			setStep(1);
		}
	}, [
		rep,
		draftOrderID,
		setDraftPageOpened,
		tableNumber,
		setStep,
		paymentStatus,
	]);
	console.log("payment status", paymentStatus);
	return (
		<>
			<Dialog.Root open={draftPageOpened} onOpenChange={setDraftPageOpened}>
				<Dialog.Trigger>
					<Button
						variant="classic"
						size="3"
						onClick={() => {
							setStep(1);
						}}
					>
						<Icons.Plus className="size-5" />
						Оформить заказ
					</Button>
				</Dialog.Trigger>
				<Dialog.Content
					className="md:min-w-[95vw] min-h-[90vh] relative bg-accent-2 p-0"
					maxWidth="95vw"
				>
					<Dialog.Title className="text-center py-4 border-accent-7 border-b-2 m-0 bg-component text-accent-11 ">
						Заказ: {draftOrder?.displayId ?? orderDisplayID + 1}
					</Dialog.Title>
					<AnimatePresence mode="wait">
						{step === 1 && (
							<SelectType
								type={type}
								setType={setType}
								setStep={setStep}
								createNewOrder={createNewOrder}
							/>
						)}
						{step === 2 && (
							<>
								<Flex>
									<AllProducts {...(draftOrder && { order: draftOrder })} />
									{draftOrder && (
										<DaftOrderOverview
											order={draftOrder}
											setTableNumber={setTableNumber}
											tableNumber={tableNumber}
										/>
									)}
								</Flex>
								<Flex
									gap="3"
									justify="between"
									p="3"
									className="bg-component absolute bottom-0 w-full border-t-2 border-accent-7"
								>
									<Dialog.Close>
										<Button
											variant="soft"
											color="gray"
											size="4"
											onClick={() => setStep(1)}
										>
											Закрыть
										</Button>
									</Dialog.Close>
									<Flex gap="2">
										<Select.Root
											value={paymentStatus as string}
											size="3"
											onValueChange={(value) =>
												setPaymentStatus(value as typeof paymentStatus)
											}
										>
											<Select.Trigger className={cn("h-12 p-0 pr-2")}>
												<Badge
													className="h-12 w-[150px] text-lg flex justify-center text-center"
													color={paymentStatus === "paid" ? "green" : "red"}
												>
													{translation[paymentStatus ?? "not_paid"]}
												</Badge>
											</Select.Trigger>
											<Select.Content>
												<Select.Group>
													{["paid" as const, "not_paid" as const].map(
														(status) => (
															<Select.Item
																value={status}
																key={status}
																className="h-10 px-2 rounded-[5px] focus:bg-accent-3  focus:text-accent-11"
															>
																{translation[status]}
															</Select.Item>
														),
													)}
												</Select.Group>
											</Select.Content>
										</Select.Root>

										<Button variant="classic" size="4" onClick={completeOrder}>
											Оформить
										</Button>
									</Flex>
								</Flex>
							</>
						)}
					</AnimatePresence>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
};

const SelectType = ({
	setType,
	type: currentType,
	setStep,
	createNewOrder,
}: {
	type: "onsite" | "takeout";
	setType: React.Dispatch<React.SetStateAction<"onsite" | "takeout">>;
	setStep: React.Dispatch<React.SetStateAction<number>>;
	createNewOrder: () => Promise<void>;
}) => {
	console.log("type current", currentType);
	return (
		<>
			<Flex p="4" py="8" justify="center">
				<ToggleGroup
					className={cn("flex justify-start gap-14")}
					type="single"
					value={currentType}
					onValueChange={(value) => setType(value as "onsite" | "takeout")}
					onClick={(e) => e.stopPropagation()}
				>
					{["onsite", "takeout"].map((type) => (
						<ToggleGroupItem
							key={type}
							value={type}
							className={cn(
								"size-[250px] border border-border rounded-[7px] flex justify-center items-center aspect-square bg-component text-3xl text-accent-9",
								{
									"border-accent-7 border-2 text-4xl font-bold":
										type === currentType,
								},
							)}
						>
							{translation[type as keyof typeof translation]}
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</Flex>
			<Flex
				gap="3"
				mt="4"
				justify="between"
				p="3"
				className="bg-component absolute bottom-0 w-full border-t-2 border-accent-7"
			>
				<Dialog.Close>
					<Button
						variant="soft"
						color="gray"
						size="4"
						onClick={() => setStep(1)}
					>
						Закрыть
					</Button>
				</Dialog.Close>
				<Button
					variant="classic"
					size="4"
					onClick={async () => {
						await createNewOrder();
						setStep(2);
					}}
				>
					Продолжить
				</Button>
			</Flex>
		</>
	);
};

const AllProducts = ({ order }: { order?: StoreOrder }) => {
	const [collectionHandle, setCollectionHandle] = React.useState<
		"main" | "beverage"
	>("main");
	const isInitialized = useDashboardStore((state) => state.isInitialized);
	const [query, setQuery] = React.useState("");
	const debouncedQuery = useDebounce(query, 300);
	const searchWorker = useDashboardStore((state) => state.searchWorker);
	const [searchResults, setSearchResults] = React.useState<
		StoreProduct[] | undefined
	>(undefined);

	const [_, startTransition] = React.useTransition();

	const allProducts_ = useDashboardStore((state) => state.products);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (debouncedQuery.length <= 0) {
			setSearchResults(undefined);
			return;
		}

		searchWorker?.postMessage({
			type: "PRODUCT_SEARCH",
			payload: {
				query: debouncedQuery,
			},
		} satisfies SearchWorkerRequest);
	}, [debouncedQuery, searchWorker]);
	React.useEffect(() => {
		if (!searchWorker) return;

		const handleMessage = (event: MessageEvent) => {
			const { type, payload } = event.data as SearchWorkerResponse;
			if (typeof type === "string" && type === "PRODUCT_SEARCH") {
				startTransition(() => {
					setSearchResults(payload as StoreProduct[]);
				});
			}
		};

		searchWorker.addEventListener("message", handleMessage);

		return () => {
			searchWorker.removeEventListener("message", handleMessage);
		};
	}, [searchWorker]);
	const allProducts = searchResults ?? allProducts_;
	const products = React.useMemo(
		() => allProducts.filter((p) => p.collectionHandle === collectionHandle),
		[collectionHandle, allProducts],
	);
	return (
		<Flex direction="column" className="w-full">
			<Flex justify="center" className="w-full relative gap-6 p-2">
				{collectionHandles.map((handle) => (
					<Button
						key={handle}
						size="3"
						variant={collectionHandle === handle ? "solid" : "surface"}
						onClick={() => setCollectionHandle(handle)}
					>
						{translation[handle]}
					</Button>
				))}
			</Flex>
			<Flex px="4" width="100%">
				<TextField.Root
					size="3"
					variant="soft"
					className="md:w-[300px]"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				>
					<TextField.Slot>
						<Icons.MagnifyingGlassIcon height="16" width="16" />
					</TextField.Slot>
					<TextField.Slot>
						<IconButton variant="ghost" size="3" onClick={() => setQuery("")}>
							<Icons.Trash className="size-4" />
						</IconButton>
					</TextField.Slot>
				</TextField.Root>
			</Flex>
			<ScrollArea className="w-full h-[65vh] relative flex p-4 justify-center">
				<Products
					products={products}
					isInitialized={isInitialized}
					isOrderCreation={true}
					{...(order && { order })}
				/>
			</ScrollArea>
		</Flex>
	);
};
const DaftOrderOverview = ({
	order,
	setTableNumber,
	tableNumber,
}: {
	order: StoreOrder;
	tableNumber: number | "";
	setTableNumber: React.Dispatch<React.SetStateAction<number | "">>;
}) => {
	const isInitialized = useDashboardStore((state) => state.isInitialized);
	const items = order.items ?? [];
	const [parent] = useAutoAnimate({ duration: 100 });
	const rep = useReplicache((state) => state.dashboardRep);

	// State for the table number input

	const deleteItem = React.useCallback(
		async (id: string) => {
			await rep?.mutate.deleteLineItem({ id, orderID: order.id });
		},
		[rep, order.id],
	);
	const updateItem = React.useCallback(
		async (id: string, quantity: number) => {
			await rep?.mutate.updateLineItem({ id, quantity, orderID: order.id });
		},
		[rep, order.id],
	);

	// Handler for table number change
	const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setTableNumber(value === "" ? "" : Number.parseInt(value, 10)); // Allow empty value or number
	};

	return (
		<Grid className="sm:w-[350px] bg-component md:w-[500px] border-l-2 border-accent-7 relative p-4">
			{order.type === "onsite" && (
				<Grid gap="2">
					<Heading size="4">Номер столика</Heading>
					<TextField.Root
						placeholder="Номер столика"
						variant="soft"
						type="number"
						value={tableNumber}
						onChange={handleTableNumberChange}
					/>
				</Grid>
			)}
			<ScrollArea className="h-[52vh] w-full">
				<Grid gap="2" ref={parent} width="100%">
					{!isInitialized &&
						Array.from({ length: 3 }).map((_, i) => (
							<LineItemSkeleton key={i} />
						))}
					{items.length === 0 && (
						<Text color="gray" className="mt-4 text-center">
							Добавьте продукт.
						</Text>
					)}
					{items.map((item) => (
						<LineItem
							lineItem={item}
							key={item.id}
							deleteItem={deleteItem}
							updateItem={updateItem}
							currencyCode={order?.currencyCode ?? "BYN"}
						/>
					))}
				</Grid>
			</ScrollArea>
			<Box position="absolute" bottom="0" right="0" width="100%">
				<Total
					className="mt-auto p-4 border-t-2 border-accent-7"
					order={order}
					lineItems={items}
				/>
			</Box>
		</Grid>
	);
};
