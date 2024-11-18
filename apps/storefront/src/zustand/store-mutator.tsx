"use client";

import React from "react";
import { useSubscribe } from "replicache-react";
import { useReplicache } from "./replicache";
import { useGlobalStore } from "./store";

export const GlobalStoreMutator = ({
	children,
	cartId,
}: { children: React.ReactNode; cartId: string | undefined }) => {
	const setIsInitialized = useGlobalStore((state) => state.setIsInitialized);
	const diffProducts = useGlobalStore((state) => state.diffProducts);
	const diffVariants = useGlobalStore((state) => state.diffVariants);
	const diffOrders = useGlobalStore((state) => state.diffOrders);
	const diffCarts = useGlobalStore((state) => state.diffCarts);

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
			prefix: "prod",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffProducts]);
	React.useEffect(() => {
		return rep?.experimentalWatch(diffVariants, {
			prefix: "var",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffVariants]);
	React.useEffect(() => {
		return rep?.experimentalWatch((diff) => diffCarts(diff, cartId), {
			prefix: "cart",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffCarts, cartId]);
	React.useEffect(() => {
		return rep?.experimentalWatch(diffOrders, {
			prefix: "ord",
			initialValuesInFirstDiff: true,
		});
	}, [rep, diffOrders]);
	return <>{children}</>;
};
