"use client";

import React from "react";
import type { ExperimentalDiff, ReadonlyJSONValue } from "replicache";
import { create, createStore, useStore } from "zustand";
import type { SearchWorkerRequest } from "../types/worker";
import type {
	StoreCart,
	StoreLineItem,
	StoreOrder,
	StoreProduct,
	StoreVariant,
} from "@blazzing-app/validators";
type Entity = ReadonlyJSONValue & { id: string };
type ExtractState<S> = S extends {
	getState: () => infer T;
}
	? T
	: never;
function commonDiffReducer({
	diff,
	map,
	searchWorker,
}: {
	diff: ExperimentalDiff;
	map: Map<string, Entity>;
	searchWorker?: Worker | undefined;
}) {
	const newMap = new Map(map);
	async function add(key: string, newValue: Entity) {
		newMap.set(key, newValue);

		searchWorker?.postMessage({
			type: "ADD",
			payload: {
				document: newValue,
			},
		} satisfies SearchWorkerRequest);
	}
	function del(key: string) {
		newMap.delete(key);

		searchWorker?.postMessage({
			type: "DELETE",
			payload: {
				key,
			},
		} satisfies SearchWorkerRequest);
	}
	function change(key: string, newValue: Entity) {
		newMap.set(key, newValue);
		searchWorker?.postMessage({
			type: "UPDATE",
			payload: {
				document: newValue,
			},
		} satisfies SearchWorkerRequest);
	}
	for (const diffOp of diff) {
		switch (diffOp.op) {
			case "add": {
				add(diffOp.key as string, diffOp.newValue as Entity);
				break;
			}
			case "del": {
				del(diffOp.key as string);
				break;
			}
			case "change": {
				change(diffOp.key as string, diffOp.newValue as Entity);
				break;
			}
		}
	}
	return { newEntities: Array.from(newMap.values()), newMap };
}

interface GlobalStore {
	isInitialized: boolean;
	carts: StoreCart[];
	products: StoreProduct[];
	variants: StoreVariant[];
	lineItems: StoreLineItem[];
	cartMap: Map<string, StoreCart>;
	lineItemMap: Map<string, StoreLineItem>;
	productsMap: Map<string, StoreProduct>;
	variantsMap: Map<string, StoreVariant>;
	orders: StoreOrder[];
	orderMap: Map<string, StoreOrder>;
	setIsInitialized(newValue: boolean): void;
	diffCarts(diff: ExperimentalDiff): void;
	diffOrders(diff: ExperimentalDiff): void;
	diffProducts(diff: ExperimentalDiff): void;
	diffVariants(diff: ExperimentalDiff): void;
	diffLineItems(diff: ExperimentalDiff): void;
}
const useGlobalStore = create<GlobalStore>()((set, get) => ({
	isInitialized: false,
	carts: [],
	users: [],
	products: [],
	variants: [],
	orders: [],
	notifications: [],

	lineItems: [],
	productsMap: new Map(),
	variantsMap: new Map(),
	userMap: new Map(),
	cartMap: new Map(),
	orderMap: new Map(),
	lineItemMap: new Map(),
	notificationMap: new Map(),

	setIsInitialized(newValue: boolean) {
		set({ isInitialized: newValue });
	},
	diffProducts(diff: ExperimentalDiff) {
		const { newEntities, newMap } = commonDiffReducer({
			diff,
			map: get().productsMap,
		});
		set({
			products: newEntities as StoreProduct[],
			productsMap: newMap as Map<string, StoreProduct>,
		});
	},
	diffVariants(diff: ExperimentalDiff) {
		const { newEntities, newMap } = commonDiffReducer({
			diff,
			map: get().variantsMap as Map<string, Entity>,
		});
		set({
			variants: newEntities as StoreVariant[],
			variantsMap: newMap as Map<string, StoreVariant>,
		});
	},
	diffCarts(diff: ExperimentalDiff, cartId?: string) {
		const { newEntities, newMap } = commonDiffReducer({
			diff,
			map: get().cartMap as Map<string, Entity>,
			...(cartId && { cartId }),
		});
		set({
			carts: newEntities as StoreCart[],
			cartMap: newMap as Map<string, StoreCart>,
		});
	},
	diffOrders(diff: ExperimentalDiff) {
		const { newEntities, newMap } = commonDiffReducer({
			diff,
			map: get().orderMap as Map<string, Entity>,
		});
		set({
			orders: newEntities as StoreOrder[],
			orderMap: newMap as Map<string, StoreOrder>,
		});
	},
	diffLineItems(diff: ExperimentalDiff) {
		const { newEntities, newMap } = commonDiffReducer({
			diff,
			map: get().lineItemMap as Map<string, Entity>,
		});
		set({
			lineItems: newEntities as StoreLineItem[],
			lineItemMap: newMap as Map<string, StoreLineItem>,
		});
	},
}));

interface GlobalSearch {
	globalSearchWorker: Worker | undefined;
	terminateSearchWorker(): void;
}
const createGlobalSearch = () =>
	createStore<GlobalSearch>((set, get) => ({
		globalSearchWorker: undefined,
		terminateSearchWorker() {
			get().globalSearchWorker?.terminate();
			set({ globalSearchWorker: undefined });
		},
	}));

const GlobalSearchContext = React.createContext<ReturnType<
	typeof createGlobalSearch
> | null>(null);
const GlobalSearchProvider = ({ children }: { children: React.ReactNode }) => {
	const [store] = React.useState(createGlobalSearch);
	// const state = store.getState();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	// useEffect(() => {
	// 	const newWorker = new Worker("/workers/search.js", {
	// 		type: "module",
	// 		name: "global_search",
	// 	});

	// 	store.setState((state) => ({
	// 		...state,
	// 		globalSearchWorker: newWorker,
	// 	}));

	// 	return () => state.terminateSearchWorker();
	// }, []);

	return (
		<GlobalSearchContext.Provider value={store}>
			{children}
		</GlobalSearchContext.Provider>
	);
};

const useGlobalSearch = <_, U>(
	selector: (
		state: ExtractState<ReturnType<typeof createGlobalSearch> | null>,
	) => U,
) => {
	const store = React.useContext(GlobalSearchContext);
	if (!store) {
		throw new Error("Missing GlobalSearchProvider");
	}
	return useStore(store, selector);
};

export {
	createGlobalSearch,
	GlobalSearchProvider,
	useGlobalSearch,
	useGlobalStore,
};
