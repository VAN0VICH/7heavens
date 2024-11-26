"use client";

import Body from "@/components/shared/typography/body";
import { convertToLocale } from "@/utils/business/money";
import type { StoreLineItem } from "@blazzing-app/validators";
import Image from "next/image";
import React from "react";

export function LineItem({ item }: { item: StoreLineItem }) {
	if (!((item?.quantity || 0) > 0)) return null;

	const unit_price = React.useMemo(
		() =>
			convertToLocale({
				amount: item?.variant.prices?.[0].amount || 0,
				currencyCode: (item?.variant.prices?.[0].currencyCode || null)!,
			}),
		[item],
	);

	const item_price = React.useMemo(
		() =>
			convertToLocale({
				amount: (item?.variant.prices?.[0].amount || 0) * (item?.quantity || 1),
				currencyCode: (item?.variant.prices?.[0].currencyCode || null)!,
			}),
		[item],
	);

	return (
		<div className="flex items-start justify-between gap-2 space-x-4">
			<Image
				alt={item.variant.title ?? "Item image"}
				className="h-[100px] w-[100px] rounded-lg border-[1.5px] border-accent object-cover"
				height={100}
				src={item.variant?.thumbnail?.url || ""}
				width={100}
			/>
			<div className="flex w-full flex-col items-start justify-start gap-4">
				<div className="flex w-full justify-between gap-3">
					<div>
						<Body className="leading-[130%]" font="sans" mobileSize="lg">
							{item.variant?.title}
						</Body>
					</div>
					<div className="flex min-w-[100px] flex-col items-end">
						<Body
							className="font-semibold opacity-80"
							font="sans"
							mobileSize="base"
						>
							{item.quantity} x {unit_price}
						</Body>
						<Body className="font-semibold" font="sans" mobileSize="base">
							{item_price}
						</Body>
					</div>
				</div>
			</div>
		</div>
	);
}
