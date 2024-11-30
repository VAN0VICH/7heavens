import type { StoreOrder } from "@blazzing-app/validators";
import { Badge } from "@radix-ui/themes";

export function OrderType({
	type,
	size = "2",
}: { type: StoreOrder["type"]; size?: "1" | "2" | "3" }) {
	return type === "delivery" ? (
		<Badge color="iris" size={size}>
			Доставка
		</Badge>
	) : type === "onsite" ? (
		<Badge color="tomato" size={size}>
			На месте
		</Badge>
	) : (
		<Badge size={size} color="crimson">
			C собой
		</Badge>
	);
}
