"use client";

import React from "react";
import { useSubscribe } from "replicache-react";
import { useReplicache } from "./replicache";
import { useDashboardStore } from "./store";

export const DashboardStoreMutator = ({
	children,
}: { children: React.ReactNode }) => {
	const setIsInitialized = useDashboardStore((state) => state.setIsInitialized);
	const setOrderDisplayID = useDashboardStore(
		(state) => state.setOrderDisplayID,
	);
	const diffProducts = useDashboardStore((state) => state.diffProducts);
	const diffOrders = useDashboardStore((state) => state.diffOrders);
	const diffDraftOrders = useDashboardStore((state) => state.diffDraftOrders);
	const diffStores = useDashboardStore((state) => state.diffStores);

	const rep = useReplicache((state) => state.dashboardRep);

	useSubscribe(
		rep,
		async (tx) => {
			const isInitialized = await tx.get<string>("init");
			const orderDisplayID = (await tx.get<number>("display_id")) ?? 0;
			console.log("getting order display id", orderDisplayID);
			setOrderDisplayID(orderDisplayID);
			setIsInitialized(!!isInitialized);
		},
		{ dependencies: [], default: null },
	);

	React.useEffect(() => {
		return rep?.experimentalWatch(diffProducts, {
			prefix: "product",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffProducts]);
	React.useEffect(() => {
		return rep?.experimentalWatch(diffStores, {
			prefix: "store",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffStores]);
	React.useEffect(() => {
		return rep?.experimentalWatch(diffOrders, {
			prefix: "order",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffOrders]);
	React.useEffect(() => {
		return rep?.experimentalWatch(diffDraftOrders, {
			prefix: "draft_order",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffDraftOrders]);
	return <>{children}</>;
};
