import LocalizedLink from "@/components/shared/localized-link";
import Body from "@/components/shared/typography/body";
import type { StoreProduct } from "@blazzing-app/validators";

export default function BreadCrumbs({
	baseVariant,
	collectionHandle,
}: Pick<StoreProduct, "collectionHandle" | "baseVariant">) {
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
