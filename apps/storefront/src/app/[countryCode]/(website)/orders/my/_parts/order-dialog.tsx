import { useGlobalStore } from "@/zustand/store";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Body from "@/components/shared/typography/body";
import { formatISODate } from "@/utils/format";
import Heading from "@/components/shared/typography/heading";
import { OrderStatus } from "@/components/order-status";
import OrderItem from "../../../order/confirmed/[id]/_parts/order-item";
import { Separator } from "@/components/ui/separator";
import Price from "@/components/price";
import type { StoreLineItem } from "@blazzing-app/validators";
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
