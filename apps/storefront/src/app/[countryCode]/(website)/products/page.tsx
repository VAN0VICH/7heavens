import type { PageProps } from "@/types";

import {
	ProductsSkeleton,
	PaginatedCollectionProducts,
} from "@/components/products/paginated-product";
// import Refinement from "@/components/products/product-refinement";
import Heading from "@/components/shared/typography/heading";
import { Suspense } from "react";

type CollectionPageProps = PageProps<
	"countryCode",
	"category" | "collection" | "page" | "sort"
>;

export default async function CollectionPage(props: CollectionPageProps) {
	//TODO: list collection API
	const collectionHandles = ["main", "beverage"];
	return (
		<section className="mx-auto flex max-w-max-screen flex-col gap-10 px-m pb-10 pt-[3rem] lg:px-xl">
			<div>
				<Heading desktopSize="7xl" font="serif" mobileSize="2xl" tag="h1">
					Меню
				</Heading>
			</div>
			<div className="flex flex-col gap-6">
				{/* <Refinement /> */}
				{collectionHandles.map((handle) => (
					<Suspense fallback={<ProductsSkeleton />} key={handle}>
						<PaginatedCollectionProducts
							handle={handle}
							title={handle === "beverage" ? "Напитки" : "Основное"}
						/>
					</Suspense>
				))}
			</div>
		</section>
	);
}
