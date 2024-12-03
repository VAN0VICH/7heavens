import type { StoreOrder } from "@blazzing-app/validators";
import { Flex, Heading } from "@radix-ui/themes";
import { redirect, type LoaderFunction } from "@remix-run/cloudflare";
import debounce from "lodash.debounce";
import React, { useTransition } from "react";
import { sortOrders } from "~/utils/helpers";
import type {
	SearchWorkerRequest,
	SearchWorkerResponse,
} from "~/worker/search";
import { useDashboardStore } from "~/zustand/store";
import { OrdersTable } from "./orders-table/table";
import { OrderPage } from "./pages/order";
import { ProductsPage } from "./pages/products";
import { DraftOrderPage } from "./pages/create-order";
import { OrderDrafts } from "./pages/drafts";
import { getAuth } from "@clerk/remix/ssr.server";
export const loader: LoaderFunction = async (args) => {
	const { userId } = await getAuth(args);
	console.log("userID", userId);

	if (!userId) {
		return redirect("/sign-in");
	}
	return Response.json({});
};

export default function Orders() {
	const orders_ = useDashboardStore((state) => state.orders);
	const orders = React.useMemo(() => sortOrders(orders_), [orders_]);
	console.log("orders", orders);

	const [searchResults, setSearchResults] = React.useState<
		StoreOrder[] | undefined
	>(undefined);
	const searchWorker = useDashboardStore((state) => state.searchWorker);
	const [_, startTransition] = useTransition();
	const [step, setStep] = React.useState(1);

	const [draftOrderID, _setDraftOrderID] = React.useState<string | undefined>();
	const [draftPageOpened, setDraftPageOpened] = React.useState(false);
	const setDraftOrderID = React.useCallback(
		(id: string | undefined, isAlreadyCreated?: boolean) => {
			_setDraftOrderID(id);
			if (id) {
				if (isAlreadyCreated) setStep(2);
				return setDraftPageOpened(true);
			}
			setDraftPageOpened(false);
		},
		[],
	);

	const [orderID, _setOrderID] = React.useState<string | undefined>();
	const [opened, setOpened] = React.useState(false);
	const setOrderID = React.useCallback((id: string | undefined) => {
		_setOrderID(id);
		if (id) return setOpened(true);
		setOpened(false);
	}, []);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const onSearch = React.useCallback(
		debounce((value: string) => {
			if (value === "") {
				setSearchResults(undefined);
				return;
			}
			searchWorker?.postMessage({
				type: "ORDER_SEARCH",
				payload: {
					query: value,
				},
			} satisfies SearchWorkerRequest);
		}, 300),
		[searchWorker],
	);
	React.useEffect(() => {
		if (searchWorker) {
			searchWorker.onmessage = (event: MessageEvent) => {
				const { type, payload } = event.data as SearchWorkerResponse;
				if (typeof type === "string" && type === "ORDER_SEARCH") {
					startTransition(() => {
						const orders: StoreOrder[] = [];
						const orderIDs = new Set<string>();
						for (const item of payload) {
							if (item.id.startsWith("order")) {
								if (orderIDs.has(item.id)) continue;
								orders.push(item as StoreOrder);
								orderIDs.add(item.id);
							}
						}
						setSearchResults(orders);
					});
				}
			};
		}
	}, [searchWorker]);
	return (
		<>
			<OrderPage opened={opened} orderID={orderID} setOpened={setOpened} />
			<Flex justify="center" className="bg-accent-2 pt-0 min-h-screen">
				<Flex width="100%" direction="column" maxWidth="1700px">
					<Flex
						gap={{ initial: "2", sm: "3" }}
						className="flex flex-col items-center gap-2 sm:gap-3 "
					>
						<nav className="h-16 flex justify-center border-b border-border bg-component w-full">
							<Flex
								justify="between"
								className="max-w-6xl px-4 w-full items-center"
							>
								<ProductsPage />
								<Heading
									size="7"
									align="center"
									className="py-2 justify-center font-freeman text-accent-11 md:justify-start"
								>
									Заказы
								</Heading>
								<OrderDrafts setDraftOrderID={setDraftOrderID} />
							</Flex>
						</nav>
						<OrdersTable
							orders={searchResults ?? orders ?? []}
							orderID={orderID}
							setOrderID={setOrderID}
							onSearch={onSearch}
							toolbar={true}
							toolbarButton={
								<DraftOrderPage
									draftOrderID={draftOrderID}
									setDraftOrderID={setDraftOrderID}
									draftPageOpened={draftPageOpened}
									setDraftPageOpened={setDraftPageOpened}
									step={step}
									setStep={setStep}
								/>
							}
						/>
					</Flex>
				</Flex>
			</Flex>
		</>
	);
}
