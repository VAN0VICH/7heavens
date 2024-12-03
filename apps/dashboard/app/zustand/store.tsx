"use client";

import type { Store, StoreOrder, StoreProduct } from "@blazzing-app/validators";
import React from "react";
import type { ExperimentalDiff, ReadonlyJSONValue } from "replicache";
import { createStore, useStore } from "zustand";
import type { SearchWorkerRequest } from "~/worker/search";
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

interface DashboardStore {
	searchWorker: Worker | undefined;
	orderDisplayID: number;
	isInitialized: boolean;
	products: StoreProduct[];
	productsMap: Map<string, StoreProduct>;
	stores: Store[];
	storesMap: Map<string, Store>;
	orders: StoreOrder[];
	orderMap: Map<string, StoreOrder>;
	draftOrders: StoreOrder[];
	draftOrderMap: Map<string, StoreOrder>;
	setIsInitialized(newValue: boolean): void;
	setOrderDisplayID(id: number): void;
	diffOrders(diff: ExperimentalDiff): void;
	diffStores(diff: ExperimentalDiff): void;
	diffProducts(diff: ExperimentalDiff): void;
	diffDraftOrders(diff: ExperimentalDiff): void;
	terminateSearchWorker(): void;
}
const createDashboardStore = () =>
	createStore<DashboardStore>()((set, get) => ({
		searchWorker: undefined,
		orderDisplayID: 0,
		isInitialized: false,
		products: [],
		stores: [],
		orders: [],
		notifications: [],
		productsMap: new Map(),
		storesMap: new Map(),
		orderMap: new Map(),
		draftOrders: [],
		draftOrderMap: new Map(),
		setIsInitialized(newValue: boolean) {
			set({ isInitialized: newValue });
		},
		setOrderDisplayID(id: number) {
			set({ orderDisplayID: id });
		},
		diffProducts(diff: ExperimentalDiff) {
			const { newEntities, newMap } = commonDiffReducer({
				diff,
				map: get().productsMap,
				searchWorker: get().searchWorker,
			});
			set({
				products: newEntities as StoreProduct[],
				productsMap: newMap as Map<string, StoreProduct>,
			});
		},
		diffStores(diff: ExperimentalDiff) {
			const { newEntities, newMap } = commonDiffReducer({
				diff,
				map: get().storesMap,
			});
			set({
				stores: newEntities as Store[],
				storesMap: newMap as Map<string, Store>,
			});
		},
		diffOrders(diff: ExperimentalDiff) {
			const { newEntities, newMap } = commonDiffReducer({
				diff,
				map: get().orderMap as Map<string, Entity>,
				searchWorker: get().searchWorker,
			});
			set({
				orders: newEntities as StoreOrder[],
				orderMap: newMap as Map<string, StoreOrder>,
			});
		},
		diffDraftOrders(diff: ExperimentalDiff) {
			const { newEntities, newMap } = commonDiffReducer({
				diff,
				map: get().draftOrderMap as Map<string, Entity>,
			});
			set({
				draftOrders: newEntities as StoreOrder[],
				draftOrderMap: newMap as Map<string, StoreOrder>,
			});
		},
		terminateSearchWorker() {
			get().searchWorker?.terminate();
			set({ searchWorker: undefined });
		},
	}));

const DashboardStoreContext = React.createContext<ReturnType<
	typeof createDashboardStore
> | null>(null);
const DashboardStoreProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const [store] = React.useState(createDashboardStore);
	const state = store.getState();
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		store.setState((state) => ({
			...state,
			searchWorker: new Worker(
				new URL("../worker/search.ts", import.meta.url),
				{ type: "module", name: "dashboard_search" },
			),
		}));

		return () => state.terminateSearchWorker();
	}, []);

	return (
		<DashboardStoreContext.Provider value={store}>
			{children}
		</DashboardStoreContext.Provider>
	);
};

const useDashboardStore = <_, U>(
	selector: (
		state: ExtractState<ReturnType<typeof createDashboardStore> | null>,
	) => U,
) => {
	const store = React.useContext(DashboardStoreContext);
	if (!store) {
		throw new Error("Missing DashboardProvider");
	}
	return useStore(store, selector);
};
export { useDashboardStore, DashboardStoreProvider };
