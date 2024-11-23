"use client";

import { cx } from "cva";
import { useEffect, useState } from "react";

import { ProductVariantsProvider } from "../product-context";
import AddToCart from "./add-to-cart";
import OptionsSelect from "./options";
import type { Product, Variant } from "@blazzing-app/validators/client";

export default function StickyAtc({
	product,
	handle,
	variant,
}: { product: Product; variant: Variant; handle: string }) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			const footer = document.getElementById("footer");
			if (footer) {
				const rect = footer.getBoundingClientRect();
				setIsVisible(rect.top > window.innerHeight);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<ProductVariantsProvider
			product={product}
			handle={handle}
			variant={variant}
		>
			<div
				className={cx(
					"fixed bottom-0 left-0 right-0 z-[80] w-screen min-w-[320px] border-t border-accent bg-background p-m transition-transform duration-300 lg:hidden",
					{
						"translate-y-0": isVisible,
						"translate-y-full": !isVisible,
					},
				)}
			>
				<div className="flex items-center justify-center gap-3">
					{product.options?.some(
						(option) => (option.optionValues?.length || 0) > 1,
					) && (
						<div className="w-fit">
							<OptionsSelect options={product.options} />
						</div>
					)}
					<AddToCart product={product} variant="sticky" />
				</div>
			</div>
		</ProductVariantsProvider>
	);
}
