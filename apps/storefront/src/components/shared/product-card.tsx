import { cx } from "cva";
import Image from "next/image";

import LocalizedLink from "./localized-link";
import Tag from "./tag";
import Body from "./typography/body";
import type { Product } from "@blazzing-app/validators/client";

export default function ProductCard({
	index,
	product,
	size = "default",
}: {
	index?: number;
	product: Product;
	size?: "PLP" | "default";
}) {
	if (!product) return null;

	const thumbnail = product.baseVariant.thumbnail?.url;

	return (
		<LocalizedLink
			className={cx(
				"flex flex-1 flex-col items-center justify-center rounded-lg",
				{
					"w-[88vw] max-w-[450px]": size === "default",
				},
			)}
			href={`/products/${product.baseVariant.handle}`}
			prefetch
		>
			<div className="relative w-full">
				{thumbnail && (
					<Image
						alt={product.baseVariant.title ?? "Product image"}
						className="aspect-square w-full rounded-lg"
						height={450}
						priority={index !== undefined && index <= 2}
						src={thumbnail}
						width={450}
					/>
				)}
				{/* {product.type?.value && (
					<Tag
						className="absolute right-4 top-3"
						text={product.type.value || ""}
					/>
				)} */}
			</div>

			<div className="pointer-events-none flex flex-1 flex-col items-center justify-center gap-1 px-lg py-s">
				<Body
					className="text-center"
					desktopSize="xl"
					font="sans"
					mobileSize="lg"
				>
					{product.baseVariant.title}
				</Body>
			</div>
		</LocalizedLink>
	);
}
