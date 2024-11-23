import ProductCard from "@/components/shared/product-card";
import type { Product } from "@blazzing-app/validators/client";

export function ProductGrid({ products }: { products: Product[] }) {
	return products?.map((product) => {
		return <ProductCard key={product.id} product={product} size="PLP" />;
	});
}
