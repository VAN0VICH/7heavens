"use client";

import type {
	StoreCart,
	StoreOrder,
	StoreProduct,
	StoreProductVariant,
} from "@medusajs/types";
import React from "react";
import type { ExperimentalDiff, ReadonlyJSONValue } from "replicache";
import { createStore, useStore } from "zustand";
import type { SearchWorkerRequest } from "../types/worker";
import { setCartId } from "@/actions/set-cart-id";
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
	cartId,
}: {
	diff: ExperimentalDiff;
	map: Map<string, Entity>;
	searchWorker?: Worker | undefined;
	cartId?: string;
}) {
	const newMap = new Map(map);
	async function add(key: string, newValue: Entity) {
		newMap.set(key, newValue);

		if (key.startsWith("cart")) {
			if (!cartId) {
				await setCartId(key);
			}
		}
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
				console.log("adding...", diffOp.newValue);
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
	variants: StoreProductVariant[];
	cartMap: Map<string, StoreCart>;
	productsMap: Map<string, StoreProduct>;
	variantsMap: Map<string, StoreProductVariant>;
	orders: StoreOrder[];
	orderMap: Map<string, StoreOrder>;
	setIsInitialized(newValue: boolean): void;
	diffCarts(diff: ExperimentalDiff, cartId?: string): void;
	diffOrders(diff: ExperimentalDiff): void;
	diffProducts(diff: ExperimentalDiff): void;
	diffVariants(diff: ExperimentalDiff): void;
}
const createGlobalStore = () =>
	createStore<GlobalStore>((set, get) => ({
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
				map: get().productsMap as any as Map<string, Entity>,
			});
			set({
				products: newEntities as any as StoreProduct[],
				productsMap: newMap as any as Map<string, StoreProduct>,
			});
		},
		diffVariants(diff: ExperimentalDiff) {
			const { newEntities, newMap } = commonDiffReducer({
				diff,
				map: get().variantsMap as any as Map<string, Entity>,
			});
			set({
				variants: newEntities as any as StoreProductVariant[],
				variantsMap: newMap as any as Map<string, StoreProductVariant>,
			});
		},
		diffCarts(diff: ExperimentalDiff, cartId?: string) {
			const { newEntities, newMap } = commonDiffReducer({
				diff,
				map: get().cartMap as any as Map<string, Entity>,
				...(cartId && { cartId }),
			});
			set({
				carts: newEntities as any as StoreCart[],
				cartMap: newMap as any as Map<string, StoreCart>,
			});
		},
		diffOrders(diff: ExperimentalDiff) {
			const { newEntities, newMap } = commonDiffReducer({
				diff,
				map: get().orderMap as any as Map<string, Entity>,
			});
			set({
				orders: newEntities as any as StoreOrder[],
				orderMap: newMap as any as Map<string, StoreOrder>,
			});
		},
	}));

const GlobalStoreContext = React.createContext<ReturnType<
	typeof createGlobalStore
> | null>(null);
const GlobalStoreProvider = ({ children }: { children: React.ReactNode }) => {
	const [store] = React.useState(createGlobalStore);

	return (
		<GlobalStoreContext.Provider value={store}>
			{children}
		</GlobalStoreContext.Provider>
	);
};

const useGlobalStore = <_, U>(
	selector: (
		state: ExtractState<ReturnType<typeof createGlobalStore> | null>,
	) => U,
) => {
	const store = React.useContext(GlobalStoreContext);
	if (!store) {
		throw new Error("Missing GlobalProvider");
	}
	return useStore(store, selector);
};

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
	const state = store.getState();

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
	createGlobalStore,
	GlobalSearchProvider,
	GlobalStoreProvider,
	useGlobalSearch,
	useGlobalStore,
};
