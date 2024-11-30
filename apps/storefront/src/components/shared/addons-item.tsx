import { AddToCartButton } from "@/app/[countryCode]/(website)/products/[handle]/_parts/add-to-cart";
import { cx } from "cva";
import Image from "next/image";

import LocalizedLink from "./localized-link";
import Body from "./typography/body";
import type { StoreProduct } from "@blazzing-app/validators";
import { PriceDetail } from "@/app/[countryCode]/(website)/products/[handle]/_parts/price";

type Props = {
	product: StoreProduct;
	cartID: string | undefined;
	variant?: "PDP" | "cart";
	tempUserID: string | undefined;
};

export function AddonsItem({
	product,
	cartID,
	variant = "PDP",
	tempUserID,
}: Props) {
	return (
		<LocalizedLink
			className="flex w-full gap-xs"
			href={`/products/${product.baseVariant.handle}`}
			prefetch
		>
			{product.baseVariant?.thumbnail?.url && (
				<Image
					alt={product.baseVariant.title ?? "Product Image"}
					className="aspect-square h-[100px] w-[100px] rounded-lg border-[1.5px] border-accent"
					height={100}
					src={product.baseVariant.thumbnail.url}
					width={100}
				/>
			)}
			<div className="flex w-full flex-col justify-between">
				<div className="flex flex-col gap-xs">
					<Body
						className="font-semibold"
						desktopSize="lg"
						font="sans"
						mobileSize="base"
					>
						{product.baseVariant.title}
					</Body>
					<Body desktopSize="base" font="sans" mobileSize="sm">
						<PriceDetail variant={product.baseVariant} />
					</Body>
				</div>
				<AddToCartButton
					tempUserID={tempUserID}
					cartID={cartID}
					className={cx("self-end", {
						"mr-4": variant === "cart",
					})}
					label="Add +"
					selectedVariant={
						(product.variants ?? []).length > 1
							? product.variants![0].id !== product.baseVariantID
								? product.variants![0]
								: product.variants![1]
							: product.baseVariant
					}
					baseVariantID={product.baseVariantID}
					variants={product.variants ?? []}
					size={variant === "PDP" ? "md" : variant === "cart" ? "sm" : null}
					variant="outline"
				/>
			</div>
		</LocalizedLink>
	);
}
