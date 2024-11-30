import type { StoreOrder } from "@blazzing-app/validators";
import {
	Badge,
	Button,
	Card,
	Flex,
	Grid,
	Heading,
	Select,
} from "@radix-ui/themes";
import React from "react";
import { translation } from "~/constants";
import { cn } from "~/ui";
import { Icons } from "~/ui/icons";
import { useReplicache } from "~/zustand/replicache";

export const PaymentInfo = ({
	paymentStatus,
	orderID,
}: {
	paymentStatus: StoreOrder["paymentStatus"];
	orderID: string | undefined;
}) => {
	const rep = useReplicache((state) => state.dashboardRep);
	const setPaymentStatus = React.useCallback(
		async (status: StoreOrder["paymentStatus"]) => {
			orderID &&
				(await rep?.mutate.updateOrder({
					id: orderID,
					updates: {
						paymentStatus: status,
					},
				}));
		},
		[rep, orderID],
	);
	return (
		<Card className="p-0 shadow">
			<Flex
				justify="between"
				p="4"
				wrap="wrap"
				gap="2"
				width="100%"
				className="border-b border-border"
			>
				<Heading size="3" className="text-accent-11">
					Информация об оплате
				</Heading>
				<Flex gap="4" align="center">
					<Select.Root
						value={paymentStatus as string}
						size="3"
						onValueChange={(value) =>
							setPaymentStatus(value as typeof paymentStatus)
						}
					>
						<Select.Trigger className={cn("h-12 p-0 pr-2")}>
							<Badge
								className="h-12 w-[150px] text-lg flex justify-center text-center"
								color={paymentStatus === "paid" ? "green" : "red"}
							>
								{translation[paymentStatus ?? "not_paid"]}
							</Badge>
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{["paid" as const, "not_paid" as const].map((status) => (
									<Select.Item
										value={status}
										key={status}
										className="h-10 px-2 rounded-[5px] focus:bg-accent-3  focus:text-accent-11"
									>
										{translation[status]}
									</Select.Item>
								))}
							</Select.Group>
						</Select.Content>
					</Select.Root>
					{paymentStatus === "paid" && (
						<Button variant="surface" color="red" size="4">
							Сделать возврат
						</Button>
					)}
				</Flex>
			</Flex>
			<Grid gap="3" p="4">
				<Flex align="center" justify="between">
					<Flex align="center" gap="1">
						<Icons.CreditCard className="size-4" />
						Visa
					</Flex>
					<dd>**** **** **** 4532</dd>
				</Flex>
			</Grid>
		</Card>
	);
};
