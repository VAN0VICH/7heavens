"use client";

import React from "react";
import { useSubscribe } from "replicache-react";
import { useReplicache } from "./replicache";
import { useGlobalStore } from "./store";

export const GlobalStoreMutator = ({
	children,
}: { children: React.ReactNode }) => {
	const setIsInitialized = useGlobalStore((state) => state.setIsInitialized);
	const diffProducts = useGlobalStore((state) => state.diffProducts);
	const diffVariants = useGlobalStore((state) => state.diffVariants);
	const diffOrders = useGlobalStore((state) => state.diffOrders);
	const diffCarts = useGlobalStore((state) => state.diffCarts);
	const diffLineItems = useGlobalStore((state) => state.diffLineItems);

	const rep = useReplicache((state) => state.storeRep);

	useSubscribe(
		rep,
		async (tx) => {
			const isInitialized = await tx.get<string>("init");
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
		return rep?.experimentalWatch(diffVariants, {
			prefix: "variant",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffVariants]);
	React.useEffect(() => {
		return rep?.experimentalWatch(diffCarts, {
			prefix: "cart",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffCarts]);
	React.useEffect(() => {
		return rep?.experimentalWatch(diffOrders, {
			prefix: "order",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffOrders]);
	React.useEffect(() => {
		return rep?.experimentalWatch(diffLineItems, {
			prefix: "line_item",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffLineItems]);
	return <>{children}</>;
};
