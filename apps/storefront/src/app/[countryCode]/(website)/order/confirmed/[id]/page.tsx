import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import { notFound } from "next/navigation";

import Price from "@/components/price";
import { Separator } from "@/components/ui/separator";
import { cartSubtotal } from "@/utils/business/cart-subtotal";
import { formatISODate } from "@/utils/format";
import type { Routes } from "@blazzing-app/functions";
import type { StoreLineItem, StoreOrder } from "@blazzing-app/validators";
import { hc } from "hono/client";
import OrderItem from "./_parts/order-item";
import { OrderConfirmedStatus } from "./_parts/order-status";

export default async function OrderConfirmedPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const id = (await params).id;

	if (!id) {
		return notFound();
	}
	const honoClient = hc<Routes>(
		process.env.NEXT_PUBLIC_BLAZZING_APP_WORKER_URL ?? "",
	);

	const response = await honoClient.order.id.$get(
		{
			query: {
				id,
			},
		},
		{
			headers: {
				"x-publishable-key":
					process.env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY ?? "",
			},
		},
	);
	if (response.ok) {
		const { result: orders } = await response.json();
		if (orders.length === 0) {
			return notFound;
		}
		const order = orders[0]!;
		const total = cartSubtotal(
			order.items as StoreLineItem[],
			order as StoreOrder,
		);
		return (
			<div className="mx-auto flex max-w-[1200px] flex-col gap-2xl px-s py-2xl md:py-8xl">
				<div className="flex flex-col gap-xs">
					<Heading
						className="mb-lg"
						desktopSize="2xl"
						font="serif"
						mobileSize="lg"
						tag="h1"
					>
						Спасибо! Ваш заказ успешно выполнен.
					</Heading>
					{(!!order.email || !!order.phone) && (
						<Body className="font-medium" desktopSize="xl" font="sans">
							Мы отправили подтверждение заказа на {order.email ?? order.phone}
						</Body>
					)}

					<Body desktopSize="base" font="sans">
						Дата заказа: {formatISODate(order.createdAt)}
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
							{order.displayId}
						</Heading>
					</Body>
					<Body
						desktopSize="base"
						font="sans"
						className="flex gap-2 items-center"
					>
						Статус заказа:
						<OrderConfirmedStatus orderID={order.id} />
					</Body>
				</div>
				<div className="flex flex-col gap-s">
					<Heading desktopSize="xl" font="serif" mobileSize="lg" tag="h2">
						Заказ
					</Heading>
					<div className="flex flex-col gap-s">
						{order.items.map((item) => {
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
									amount={total}
									currencyCode={order.currencyCode ?? "BYN"}
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
							<Heading desktopSize="base" font="sans" mobileSize="sm" tag="h4">
								Всего
							</Heading>
							<Heading desktopSize="base" font="sans" mobileSize="sm" tag="h4">
								<Price amount={total} currencyCode={order.currencyCode} />
							</Heading>
						</div>
						<Separator />
					</div>
				</div>
				{order.type === "delivery" && (
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
		);
	}

	// const shippingMethod = order.shi?.[0];
}
