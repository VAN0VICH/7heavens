import Body from "@/components/shared/typography/body";
import Heading from "@/components/shared/typography/heading";
import { notFound } from "next/navigation";

import { env } from "@/app/env";
import { cartSubtotal } from "@/utils/business/cart-subtotal";
import type { Routes } from "@blazzing-app/functions";
import type { StoreLineItem, StoreOrder } from "@blazzing-app/validators";
import { hc } from "hono/client";
import OrderItem from "./_parts/order-item";
import Price from "@/components/price";

export default async function OrderConfirmedPage({
	params,
}: { params: { id: string } }) {
	const id = params.id;
	console.log("id", id);

	if (!id) {
		return notFound();
	}
	const honoClient = hc<Routes>(env.NEXT_PUBLIC_BLAZZING_APP_WORKER_URL);

	const response = await honoClient.order.id.$get(
		{
			query: {
				id,
			},
		},
		{
			headers: {
				"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
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
						Дата заказа:{" "}
						{new Date(order?.createdAt).toLocaleDateString("en-US", {
							day: "numeric",
							month: "long",
							year: "numeric",
						})}
					</Body>
					<Body desktopSize="base" font="sans">
						Номер заказа: {order.displayId}
					</Body>
				</div>
				<div className="flex flex-col gap-s">
					<Heading desktopSize="xl" font="serif" mobileSize="lg" tag="h2">
						Summary
					</Heading>
					<div className="flex flex-col gap-s">
						{order.items.map((item) => {
							return <OrderItem key={item.id} item={item as StoreLineItem} />;
						})}
						<Separator />
						<SubLineItem
							title="Subtotal"
							value={total}
							currencyCode={order.currencyCode ?? "BYN"}
						/>
						{/* <SubLineItem title="Taxes" value={convertMoney(order.tax_total)} /> */}
						{/* <SubLineItem
							title="Shipping"
							value={convertMoney(order.shipping_total)}
						/> */}
						<Separator />
						<div className="flex justify-between">
							<Heading desktopSize="base" font="sans" mobileSize="sm" tag="h4">
								Total
							</Heading>
							<Heading desktopSize="base" font="sans" mobileSize="sm" tag="h4">
								<Price amount={total} currencyCode={order.currencyCode} />
							</Heading>
						</div>
						<Separator />
					</div>
				</div>
				{}
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

function Separator() {
	return <div className="h-px w-full bg-accent" />;
}

function SubLineItem({
	title,
	value,
	currencyCode,
}: { title: string; value: number; currencyCode: string }) {
	return (
		<div className="flex items-center justify-between gap-xl">
			<Body className="mb-[6px] font-semibold" desktopSize="base" font="sans">
				{title}
			</Body>
			<Body className="mb-[6px] font-semibold" desktopSize="base" font="sans">
				<Price amount={value} currencyCode={currencyCode} />
			</Body>
		</div>
	);
}
