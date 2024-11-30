import Price from "@/components/price";
import Body from "@/components/shared/typography/body";
import { convertToLocale } from "@/utils/business/money";
import type { StoreLineItem } from "@blazzing-app/validators";
import Image from "next/image";

export default function OrderItem({ item }: { item: StoreLineItem }) {
	const unit_price_to_locale = convertToLocale({
		amount: item.variant.prices![0]!.amount / 100,
		currencyCode: item.variant.prices![0]!.currencyCode,
	});

	const image = item.variant?.images?.[0]?.url;

	return (
		<div className="flex w-full gap-xs">
			{image && (
				<Image
					alt={item.variant.title ?? "Item image"}
					className="aspect-square h-[100px] w-[100px] rounded-lg border-[1.5px] border-accent"
					height={100}
					src={image}
					width={100}
				/>
			)}
			<div className="flex w-full flex-col justify-between">
				<div className="flex justify-between gap-xl">
					<div className="flex flex-col items-start justify-start gap-1">
						<Body className="font-medium" font="sans" mobileSize="sm">
							{item.variant?.title}
						</Body>
					</div>
					<div className="flex flex-col items-end justify-end gap-1">
						<Body className="opacity-80" font="sans" mobileSize="base">
							{item.quantity} x {unit_price_to_locale}
						</Body>
						<Body font="sans" mobileSize="base">
							<Price
								amount={item.variant.prices![0]!.amount * item.quantity}
								currencyCode={item.variant.prices![0]!.currencyCode}
							/>
						</Body>
					</div>
				</div>
			</div>
		</div>
	);
}
