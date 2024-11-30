import type { StoreOrder } from "@blazzing-app/validators";
import { Box, Card, Flex, Grid, Text } from "@radix-ui/themes";
import { formatISODate } from "~/utils/format";
import { useDashboardStore } from "~/zustand/store";
import { OrderStatus } from "../badge/order-status";
import { LineItem, LineItemSkeleton } from "../templates/line-item/line-item";
import { Total } from "./total";

export const OrderInfo = ({ order }: { order: StoreOrder | undefined }) => {
	const isInitialized = useDashboardStore((state) => state.isInitialized);
	const items = order?.items ?? [];

	return (
		<Card className="p-0 shadow">
			<Flex justify="between" align="center">
				<Flex justify="between" p="4" wrap="wrap" gap="2" width="100%">
					<Grid gap="1">
						<Flex gap="2" align="center">
							<Box className="w-[300px] text-ellipsis overflow-hidden text-nowrap">
								<Text
									size="6"
									className="font-bold "
								>{`Заказ: ${order?.displayId}`}</Text>
							</Box>
						</Flex>
						<Text size="2">{formatISODate(order?.createdAt)}</Text>
					</Grid>

					<Flex gap="4" align="center">
						<OrderStatus
							status={order?.status ?? "pending"}
							size="3"
							className="h-12 text-lg px-4 rounded-[5px]"
						/>
					</Flex>
				</Flex>
			</Flex>
			<Grid gap="2" p="4" pt="0">
				{!isInitialized &&
					Array.from({ length: 3 }).map((_, i) => <LineItemSkeleton key={i} />)}
				{items.length === 0 && (
					<Text align="center" color="gray">
						Заказ пуст.
					</Text>
				)}
				{items.map((item) => (
					<LineItem
						lineItem={item}
						key={item.id}
						currencyCode={order?.currencyCode ?? "BYN"}
						readonly={true}
					/>
				))}
			</Grid>
			<Grid p="4">{order && <Total order={order} lineItems={items} />}</Grid>
		</Card>
	);
};
