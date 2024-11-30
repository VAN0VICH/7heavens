import type { StoreOrder } from "@blazzing-app/validators";
import { Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import { ShippingStatus } from "../badge/shipping-status";

export const ShippingInfo = ({
	shippingStatus,
	order,
}: {
	shippingStatus: StoreOrder["shippingStatus"];
	order: StoreOrder | undefined;
}) => {
	if (!order?.shippingAddress) return null;
	return (
		<Card className="p-0 shadow">
			<Flex justify="between" p="4" wrap="wrap" gap="2" width="100%">
				<Heading size="3" className="text-accent-11">
					Доставка
				</Heading>
				<Flex gap="4" align="center">
					<ShippingStatus status={shippingStatus ?? "pending"} />
				</Flex>
			</Flex>
			<Grid gap="3" p="4">
				<address className="grid gap-0.5 not-italic">
					<Text>{order?.fullName}</Text>
					<Text>{order?.shippingAddress?.line1}</Text>
					<Text>{`${order?.shippingAddress?.city}, ${order?.shippingAddress?.state}, ${order?.shippingAddress?.postalCode}`}</Text>
				</address>
			</Grid>
		</Card>
	);
};
