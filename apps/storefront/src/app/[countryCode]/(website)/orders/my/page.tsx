"use client";
import { OrderStatus } from "@/components/order-status";
import Price from "@/components/price";
import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { formatISODate, sortOrders } from "@/utils/format";
import { useGlobalStore } from "@/zustand/store";
import type { StoreLineItem } from "@blazzing-app/validators";
import React, { useMemo } from "react";
import OrderItem from "../../order/confirmed/[id]/_parts/order-item";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scrollarea";

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

export function DialogDemo({
	opened,
	orderID,
	setOpened,
}: {
	orderID: string;
	opened: boolean;
	setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const orderMap = useGlobalStore((store) => store.orderMap);
	const order = orderMap.get(orderID);
	return (
		<Dialog open={opened} onOpenChange={setOpened}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-lg">Заказ</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex flex-col gap-xs">
						<Body desktopSize="base" font="sans">
							Дата заказа: {formatISODate(order?.createdAt)}
						</Body>
						<Body
							desktopSize="base"
							font="sans"
							className="flex gap-2 items-center"
						>
							Номер заказа:
							<Heading
								tag="h2"
								desktopSize={"lg"}
								mobileSize="lg"
								className="border-2 border-orange-500 p-1 rounded-[5px] bg-orange-200 px-4"
							>
								{order?.displayId}
							</Heading>
						</Body>
						<Body
							desktopSize="base"
							font="sans"
							className="flex gap-2 items-center"
						>
							Статус заказа:
							{order && <OrderStatus status={order.status} />}
						</Body>
					</div>
					<div className="flex flex-col gap-s">
						<div className="flex flex-col gap-s">
							{order?.items.map((item) => {
								return <OrderItem key={item.id} item={item as StoreLineItem} />;
							})}
							<Separator />
							<div className="flex items-center justify-between gap-xl">
								<Body
									className="mb-[6px] font-semibold"
									desktopSize="base"
									font="sans"
								>
									Итого
								</Body>
								<Body
									className="mb-[6px] font-semibold"
									desktopSize="base"
									font="sans"
								>
									<Price
										amount={order?.total ?? -1}
										currencyCode={order?.currencyCode ?? "BYN"}
									/>
								</Body>
							</div>
							{/* <SubLineItem title="Taxes" value={convertMoney(order.tax_total)} /> */}
							{/* <SubLineItem
							title="Shipping"
							value={convertMoney(order.shipping_total)}
						/> */}
							<Separator />
							<div className="flex justify-between">
								<Heading
									desktopSize="base"
									font="sans"
									mobileSize="sm"
									tag="h4"
								>
									Всего
								</Heading>
								<Heading
									desktopSize="base"
									font="sans"
									mobileSize="sm"
									tag="h4"
								>
									{order && (
										<Price
											amount={order.total}
											currencyCode={order.currencyCode}
										/>
									)}
								</Heading>
							</div>
							<Separator />
						</div>
					</div>
					{order?.type === "delivery" && (
						<div className="flex flex-col gap-s">
							<Heading desktopSize="xl" font="serif" mobileSize="lg" tag="h2">
								Доставка
							</Heading>
							<div className="flex flex-col gap-xl lg:flex-row lg:gap-s">
								<div className="flex flex-1 flex-col gap-[6px]">
									<Body
										className="mb-[6px] font-semibold"
										desktopSize="base"
										font="sans"
									>
										Адресс
									</Body>
									<Body className="font-medium" desktopSize="base" font="sans">
										{order.fullName}
									</Body>
									<Body className="font-medium" desktopSize="base" font="sans">
										{order.shippingAddress?.line1}
									</Body>
									<Body className="font-medium" desktopSize="base" font="sans">
										{order.shippingAddress?.city}
									</Body>
								</div>
								<div className="flex flex-1 flex-col gap-[6px]">
									<Body
										className="mb-[6px] font-semibold"
										desktopSize="base"
										font="sans"
									>
										Contact
									</Body>
									<Body className="font-medium" desktopSize="base" font="sans">
										{order.email}
									</Body>
								</div>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
