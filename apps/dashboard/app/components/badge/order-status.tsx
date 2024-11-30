import type { StoreOrder } from "@blazzing-app/validators";
import { Badge } from "@radix-ui/themes";
import { Ping } from "~/ui/ping";

export function OrderStatus({
	status,
	size = "2",
	className,
}: {
	status: StoreOrder["status"];
	size?: "1" | "2" | "3";
	className?: string;
}) {
	return status === "pending" ? (
		<Badge color="yellow" variant="surface" size={size} className={className}>
			<Ping className="bg-yellow-11" />
			Ожидается
		</Badge>
	) : status === "completed" ? (
		<Badge color="green" variant="solid" size={size} className={className}>
			Завершен
		</Badge>
	) : status === "processing" ? (
		<Badge size={size} variant="surface" color="green" className={className}>
			<Ping className="bg-green-11" />В обработке
		</Badge>
	) : (
		<Badge size={size} variant="surface" color="gray" className={className}>
			Отменен
		</Badge>
	);
}
