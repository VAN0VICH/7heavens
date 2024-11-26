import Icon from "@/components/shared/icon";

import { getProductsByCollectionHandle } from "@/data/blazzing-app/product-and-variant";
import { ProductGrid } from "./grid";
import Heading from "@/components/shared/typography/heading";

export async function PaginatedCollectionProducts({
	handle,
	title,
}: { handle: string; title: string }) {
	console.log("handle collection", handle);
	const products = await getProductsByCollectionHandle(handle);

	return (
		<div className="grid gap-2">
			<Heading tag="h2">{title}</Heading>
			<div className="grid grid-cols-2 gap-x-2 gap-y-4 lg:grid-cols-3">
				<ProductGrid products={products} />
			</div>
		</div>
	);
}

export function ProductsSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-x-2 gap-y-4 lg:grid-cols-3">
			{[...Array(4)].map((_, index) => (
				<div key={index}>
					<div className="relative aspect-square w-full rounded-lg border border-accent">
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							<Icon
								className="size-10 animate-spin-loading"
								name="LoadingAccent"
							/>
						</div>
					</div>
					<div className="flex flex-col items-center justify-center gap-1 px-lg py-s">
						<div className="h-[30px] w-3/4 rounded-s bg-accent opacity-10" />
						<div className="h-6 w-1/2 rounded-s bg-accent opacity-10" />
					</div>
				</div>
			))}
		</div>
	);
}
