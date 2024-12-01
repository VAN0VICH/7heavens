"use client";

import { OrderStatus } from "@/components/order-status";
import { useGlobalStore } from "@/zustand/store";

export function OrderConfirmedStatus({ orderID }: { orderID: string }) {
	const orderMap = useGlobalStore((store) => store.orderMap);
	const order = orderMap.get(orderID);
	const status = order?.status ?? "pending";
	return <OrderStatus status={status} />;
}
