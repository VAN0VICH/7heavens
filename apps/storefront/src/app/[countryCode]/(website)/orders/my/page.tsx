"use client";
import { OrderStatus } from "@/components/order-status";
import Price from "@/components/price";
import Heading from "@/components/shared/typography/heading";
import { ScrollArea } from "@/components/ui/scrollarea";
import { sortOrders } from "@/utils/format";
import { useGlobalStore } from "@/zustand/store";
import React, { useMemo } from "react";
import { DialogDemo } from "./_parts/order-dialog";

export default function Orders() {
	const [opened, setOpened] = React.useState(false);
	const [orderID, setOrderID] = React.useState<string>();
	const orders_ = useGlobalStore((store) => store.orders);
	const orders = useMemo(() => sortOrders(orders_), [orders_]);
	return (
		<>
			{orderID && (
				<DialogDemo opened={opened} setOpened={setOpened} orderID={orderID} />
			)}
			<div className="flex justify-center w-full">
				<div className="p-4 max-w-xl w-full">
					<Heading tag="h1">Мои заказы</Heading>
					<ScrollArea className="flex h-[80vh] flex-col gap-2">
						{orders.map((order) => (
							<div
								key={order.id}
								className="bg-orange-100 p-4 mb-2 rounded-[5px] w-full flex items-center justify-between shadow border-2 border-orange-500"
								onClick={() => {
									setOrderID(order.id);
									setOpened(true);
								}}
								onKeyDown={(e) => {
									if (e.key === "enter") {
										setOrderID(order.id);
										setOpened(true);
									}
								}}
							>
								<div className="grid gap-2">
									<p>Заказ: {order.displayId}</p>
									<OrderStatus status={order.status} />
								</div>
								<Price amount={order.total} currencyCode={order.currencyCode} />
							</div>
						))}
					</ScrollArea>
				</div>
			</div>
		</>
	);
}
