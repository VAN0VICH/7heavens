import type { StoreOrder } from "@blazzing-app/validators";
import {
	AlertDialog,
	Box,
	Button,
	Dialog,
	Flex,
	ScrollArea,
} from "@radix-ui/themes";
import React from "react";
import { CustomerInfo, CustomerNote } from "~/components/info/customer";
import { OrderInfo } from "~/components/info/order";
import { PaymentInfo } from "~/components/info/payment";
import { ShippingInfo } from "~/components/info/shipping";
import { Ping } from "~/ui/ping";
import { toast } from "~/ui/toast";
import { useReplicache } from "~/zustand/replicache";
import { useDashboardStore } from "~/zustand/store";

export const OrderPage = ({
	orderID,
	opened,
	setOpened,
}: {
	orderID: string | undefined;
	opened: boolean;
	setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const orderMap = useDashboardStore((state) => state.orderMap);
	const rep = useReplicache((state) => state.dashboardRep);
	const [completeAlertOpened, setCompleteAlertOpened] = React.useState(false);
	const [cancelAlertOpened, setCancelAlertOpened] = React.useState(false);
	const order = orderMap.get(orderID ?? "");
	const setStatus = React.useCallback(
		async (status: StoreOrder["status"]) => {
			orderID &&
				(await rep?.mutate.updateOrder({
					id: orderID,
					updates: {
						status,
					},
				}));
			status === "cancelled" && setOpened(false);
			status === "completed" && setOpened(false);
		},
		[rep, orderID, setOpened],
	);
	return (
		<>
			<CancelConfirmation
				setStatus={setStatus}
				opened={cancelAlertOpened}
				setOpened={setCancelAlertOpened}
				status={order?.status ?? "pending"}
			/>
			<CompleteConfirmation
				setStatus={setStatus}
				opened={completeAlertOpened}
				setOpened={setCompleteAlertOpened}
				status={order?.status ?? "pending"}
			/>
			<Dialog.Root open={opened} onOpenChange={setOpened}>
				<Dialog.Content
					className="md:min-w-[95vw] min-h-[90vh] relative bg-accent-2 p-0"
					maxWidth="95vw"
				>
					<ScrollArea className="w-full h-[85vh] relative flex p-4 justify-center">
						<Box className="w-full flex flex-col lg:flex-row gap-3">
							<Box className="w-full lg:w-8/12 md:min-w-[700px] flex flex-col gap-3 order-1 lg:order-0">
								<OrderInfo order={order} />
								<PaymentInfo
									orderID={order?.id}
									paymentStatus={order?.paymentStatus ?? "not_paid"}
								/>
								<ShippingInfo
									shippingStatus={order?.shippingStatus ?? "pending"}
									order={order}
								/>
							</Box>
							<Box className="w-full lg:w-4/12 flex order-0 flex-col gap-3 lg:order-1">
								<CustomerInfo order={order} />
								<CustomerNote />
							</Box>
						</Box>
					</ScrollArea>

					<Flex
						gap="3"
						mt="4"
						justify="between"
						p="3"
						className="bg-component absolute bottom-0 w-full border-t-2 border-accent-7"
					>
						<Dialog.Close>
							<Button variant="soft" color="gray" size="4">
								Закрыть
							</Button>
						</Dialog.Close>
						<Flex gap="2">
							<Button
								variant={"surface"}
								color="red"
								size="4"
								disabled={
									order?.status === "completed" || order?.status === "cancelled"
								}
								onClick={() => setCancelAlertOpened(true)}
							>
								Отменить
							</Button>
							<Button
								variant={"surface"}
								color="green"
								size="4"
								disabled={
									order?.status === "completed" || order?.status === "cancelled"
								}
								onClick={async () => {
									if (order?.status === "processing")
										return await setStatus("pending");
									await setStatus("processing");
								}}
							>
								{order?.status === "processing" && (
									<Ping className="bg-green-9" />
								)}
								{order?.status === "processing"
									? "Обрабатываем..."
									: "Обработать"}
							</Button>
							<Button
								variant="classic"
								color="green"
								size="4"
								disabled={
									order?.status === "completed" || order?.status === "cancelled"
								}
								onClick={() => setCompleteAlertOpened(true)}
							>
								Завершить
							</Button>
						</Flex>
					</Flex>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
};

const CompleteConfirmation = ({
	opened,
	setOpened,
	status,
	setStatus,
}: {
	opened: boolean;
	setOpened: React.Dispatch<React.SetStateAction<boolean>>;
	status: StoreOrder["status"];
	setStatus: (status: StoreOrder["status"]) => Promise<void>;
}) => {
	return (
		<AlertDialog.Root open={opened} onOpenChange={setOpened}>
			<AlertDialog.Content maxWidth="450px">
				<AlertDialog.Title size="6">Подтверждение</AlertDialog.Title>
				<AlertDialog.Description size="4" className="py-4">
					Уверены что хотите завершить заказ?
				</AlertDialog.Description>

				<Flex gap="3" mt="4" justify="end">
					<AlertDialog.Cancel>
						<Button variant="soft" color="gray" size="4">
							Отмена
						</Button>
					</AlertDialog.Cancel>
					<AlertDialog.Action>
						<Button
							variant="classic"
							color="green"
							size="4"
							disabled={status === "completed"}
							onClick={async () => {
								status !== "completed" && setStatus("completed");
								toast.success("Заказ успешно завершен.");
							}}
						>
							Завершить заказ
						</Button>
					</AlertDialog.Action>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
};
const CancelConfirmation = ({
	opened,
	setOpened,
	status,
	setStatus,
}: {
	opened: boolean;
	setOpened: React.Dispatch<React.SetStateAction<boolean>>;
	status: StoreOrder["status"];
	setStatus: (status: StoreOrder["status"]) => Promise<void>;
}) => {
	return (
		<AlertDialog.Root open={opened} onOpenChange={setOpened}>
			<AlertDialog.Content maxWidth="450px">
				<AlertDialog.Title size="6">Подтверждение</AlertDialog.Title>
				<AlertDialog.Description size="4" className="py-4">
					Уверены что хотите отменить заказ?
				</AlertDialog.Description>

				<Flex gap="3" mt="4" justify="end">
					<AlertDialog.Cancel>
						<Button variant="soft" color="gray" size="4">
							Отмена
						</Button>
					</AlertDialog.Cancel>
					<AlertDialog.Action>
						<Button
							variant="classic"
							color="red"
							size="4"
							disabled={status === "cancelled"}
							onClick={async () => {
								status !== "cancelled" && setStatus("cancelled");
								toast.success("Заказ успешно отменен.");
							}}
						>
							Отменить заказ
						</Button>
					</AlertDialog.Action>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
};
