"use client";

import { cx } from "cva";
import React from "react";

import type { StoreProduct, StoreVariant } from "@blazzing-app/validators";
import { ProductVariantsProvider } from "../product-context";
import AddToCart from "./add-to-cart";
import OptionsSelect from "./options";

export default function StickyAtc({
	product,
	handle,
	cartID,
	variant,
}: {
	product: StoreProduct;
	variant: StoreVariant;
	handle: string;
	cartID: string | undefined;
}) {
	const [isVisible, setIsVisible] = React.useState(true);

	React.useEffect(() => {
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
					<AddToCart product={product} variant="sticky" cartID={cartID} />
				</div>
			</div>
		</ProductVariantsProvider>
	);
}
