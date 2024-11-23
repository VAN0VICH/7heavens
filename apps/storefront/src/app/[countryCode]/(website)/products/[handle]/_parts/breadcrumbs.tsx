import LocalizedLink from "@/components/shared/localized-link";
import Body from "@/components/shared/typography/body";
import type { Product } from "@blazzing-app/validators/client";

export default function BreadCrumbs({
	baseVariant,
	collectionHandle,
}: Pick<Product, "collectionHandle" | "baseVariant">) {
	return (
		<Body className="-mb-1" desktopSize="base" font="sans" mobileSize="sm">
			<LocalizedLink href="/">Home</LocalizedLink>{" "}
			{collectionHandle && (
				<>
					{" / "}
					{collectionHandle}
				</>
			)}
			{" / "}
			{baseVariant.title}
		</Body>
	);
}
