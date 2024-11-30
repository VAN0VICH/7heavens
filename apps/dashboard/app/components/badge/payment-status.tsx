import type { StoreOrder } from "@blazzing-app/validators";
import { Badge } from "@radix-ui/themes";
import { Ping } from "~/ui/ping";
export function PaymentStatus({
	status,
	size = "2",
	className,
}: {
	status: StoreOrder["paymentStatus"];
	size?: "1" | "2" | "3";
	className?: string;
}) {
	return status === "paid" ? (
		<Badge color="green" variant="solid" size={size} className={className}>
			Оплачено
		</Badge>
	) : status === "not_paid" ? (
		<Badge color="red" variant="surface" size={size} className={className}>
			<Ping className="bg-red-11" />
			Не оплачено
		</Badge>
	) : status === "partially_refunded" ? (
		<Badge color="gray" size={size} variant="surface" className={className}>
			Возврат частями
		</Badge>
	) : (
		<Badge color="gray" variant="surface" size={size} className={className}>
			Возврат
		</Badge>
	);
}
