import type { StoreProduct } from "@blazzing-app/validators";
import {
	Button,
	Dialog,
	Flex,
	IconButton,
	ScrollArea,
	TextField,
} from "@radix-ui/themes";
import { useDebounce } from "@uidotdev/usehooks";
import React from "react";
import { Products } from "~/components/templates/products/products";
import { collectionHandles, translation } from "~/constants";
import { Icons } from "~/ui/icons";
import type {
	SearchWorkerRequest,
	SearchWorkerResponse,
} from "~/worker/search";
import { useDashboardStore } from "~/zustand/store";

export const ProductsPage = () => {
	const [opened, setOpened] = React.useState(false);
	const [collectionHandle, setCollectionHandle] = React.useState<
		"main" | "beverage"
	>("main");
	const [query, setQuery] = React.useState("");
	const debouncedQuery = useDebounce(query, 300);
	const searchWorker = useDashboardStore((state) => state.searchWorker);
	const [searchResults, setSearchResults] = React.useState<
		StoreProduct[] | undefined
	>(undefined);

	const [_, startTransition] = React.useTransition();

	const products = useDashboardStore((state) => state.products);
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

	return (
		<>
			<Dialog.Root open={opened} onOpenChange={setOpened}>
				<Dialog.Trigger>
					<Button variant="surface" size="4">
						Продукты
					</Button>
				</Dialog.Trigger>
				<Dialog.Content
					className="md:min-w-[95vw] min-h-[90vh] relative bg-accent-2 p-0"
					maxWidth="95vw"
				>
					<Flex justify="center" className="w-full relative  gap-6 p-4">
						{collectionHandles.map((handle) => (
							<Button
								key={handle}
								size="4"
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
								<IconButton
									variant="ghost"
									size="3"
									onClick={() => setQuery("")}
								>
									<Icons.Trash className="size-4" />
								</IconButton>
							</TextField.Slot>
						</TextField.Root>
					</Flex>

					<ScrollArea className="w-full h-[68vh] relative flex p-4 justify-center">
						<AllProducts
							handle={collectionHandle}
							allProducts={searchResults ?? products}
						/>
					</ScrollArea>

					<Flex
						gap="3"
						justify="between"
						p="3"
						className="bg-component absolute bottom-0 w-full border-t-2 border-accent-7"
					>
						<Dialog.Close>
							<Button variant="soft" color="gray" size="4">
								Закрыть
							</Button>
						</Dialog.Close>
					</Flex>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
};

const AllProducts = ({
	handle,
	allProducts,
}: { handle: string; allProducts: StoreProduct[] }) => {
	const products = React.useMemo(
		() => allProducts.filter((p) => p.collectionHandle === handle),
		[handle, allProducts],
	);
	const isInitialized = useDashboardStore((state) => state.isInitialized);
	return <Products products={products} isInitialized={isInitialized} />;
};
