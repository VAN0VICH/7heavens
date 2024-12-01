import type { StoreOrder } from "@blazzing-app/validators";
import { Ping } from "./ui/ping";

export function OrderStatus({ status }: { status: StoreOrder["status"] }) {
	return status === "pending" ? (
		<div className="p-2 flex items-center gap-2 rounded-[5px] border-2 border-yellow-600 text-yellow-600 bg-yellow-200">
			<Ping className="bg-yellow-600" />
			Ожидается
		</div>
	) : status === "completed" ? (
		<div className="p-2 flex items-center gap-2 rounded-[5px]  text-white bg-green-600">
			Завершен
		</div>
	) : status === "processing" ? (
		<div className="p-2  flex items-center gap-2 rounded-[5px] border-2 border-green-600 text-green-600 bg-green-200">
			<Ping className="bg-green-500" />В обработке
		</div>
	) : (
		<div className="p-2 flex items-center gap-2 rounded-[5px]  text-white bg-red-500">
			Отменен
		</div>
	);
}
