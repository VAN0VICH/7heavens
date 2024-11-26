"use client";

import {
	Root,
	Slides,
	SlidesWrapper,
	useCarousel,
} from "@/components/shared/carousel";
import type { StoreVariant } from "@blazzing-app/validators";
import { cx } from "cva";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

type CommonProductImagesCarouselProps = {
	variant: StoreVariant;
};

export function ProductImagesCarousel({
	variant,
}: CommonProductImagesCarouselProps) {
	const [selectedImageIndex, setSelectedImageIdex] = useState(0);

	const images = variant.images;

	if (images?.length === 0 || !images) return null;

	const slides = images?.map((image, index) => {
		return (
			<Fragment key={image.id}>
				{image.url && (
					<Image
						alt={variant.title ?? "product image"}
						className="aspect-thin aspect-square w-full rounded-2xl object-cover object-bottom"
						height={591}
						priority={index === 0}
						sizes="(min-width: 1360px) 600px, (min-width: 1040px) calc(92vw - 633px), 100vw"
						src={image.url}
						style={{ background: "transparent" }}
						width={591}
					/>
				)}
			</Fragment>
		);
	});

	return (
		<Root
			options={{ containScroll: "trimSnaps", dragFree: true }}
			slidesCount={images?.length || 0}
		>
			<div className="mx-auto flex w-full gap-2 lg:sticky lg:top-[calc(var(--header-height)+24px)] lg:mx-0 lg:max-w-[684px]">
				{(images?.length || 0) > 0 && (
					<div className={cx("hidden w-[85px] flex-col gap-2 lg:flex")}>
						{images?.map((mediaItem, index) => (
							<ItemCarousel
								index={index}
								key={index}
								mediaItem={mediaItem as StoreVariant["images"][0]}
								selectedImageIndex={selectedImageIndex}
								setSelectedImageIdex={(index) => {
									setSelectedImageIdex(index);
								}}
							/>
						))}
					</div>
				)}
				<SlidesWrapper
					className={cx("scrollbar-hide mt-1 h-fit w-full gap-xs px-m lg:px-0")}
				>
					<Slides
						content={slides}
						itemProps={{
							className:
								"relative flex w-[86vw] min-w-full snap-center justify-center lg:w-full",
						}}
						wrapperDiv={{
							className: "snap-x snap-mandatory gap-xs",
						}}
					/>
				</SlidesWrapper>
			</div>
		</Root>
	);
}

function ItemCarousel({
	index,
	mediaItem,
	selectedImageIndex,
	setSelectedImageIdex,
}: {
	index: number;
	mediaItem: StoreVariant["images"][0];
	selectedImageIndex: number;
	setSelectedImageIdex: (index: number) => void;
}) {
	const { api } = useCarousel();

	useEffect(() => {
		api?.scrollTo(selectedImageIndex);
	}, [api, selectedImageIndex]);

	return (
		<button
			className="w-[85px] overflow-hidden rounded-lg"
			type="button"
			onClick={() => {
				setSelectedImageIdex(index);
			}}
		>
			{mediaItem.url && (
				<Image
					alt={`carousel-item-${index}`}
					className="aspect-square h-[85px] w-[85px] object-cover object-center"
					height={85}
					sizes="85px"
					src={mediaItem.url}
					width={85}
				/>
			)}
		</button>
	);
}
