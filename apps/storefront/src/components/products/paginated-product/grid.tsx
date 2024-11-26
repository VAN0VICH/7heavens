import ProductCard from "@/components/shared/product-card";
import type { StoreProduct } from "@blazzing-app/validators";

export function ProductGrid({ products }: { products: StoreProduct[] }) {
	return products?.map((product) => {
		return <ProductCard key={product.id} product={product} size="PLP" />;
	});
}
