import type { StoreOrder } from "@blazzing-app/validators";
import { Box, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";

export const CustomerInfo = ({
	order,
}: { order: StoreOrder | undefined | null }) => {
	return (
		<Card className="p-0 shadow">
			<Flex
				p="4"
				justify="between"
				align="center"
				className="border-b border-border"
			>
				<Heading size="3" className="text-accent-11">
					Информация покупателя
				</Heading>
			</Flex>
			<Box p="4">
				<Heading size="5" align="center" className="text-accent-11 py-2">
					{order?.customer?.user?.username ?? order?.fullName}
				</Heading>
				<Grid width="100%" pt="4">
					<address className="grid gap-0.5 not-italic ">
						<Flex justify="between">
							<Text className="font-semibold" size="3">
								email:
							</Text>
							<Text size="3">{order?.email}</Text>
						</Flex>
						<Flex justify="between">
							<Text className="font-semibold" size="3">
								телефон:
							</Text>
							<Text size="3">{order?.phone}</Text>
						</Flex>
					</address>
				</Grid>
			</Box>
		</Card>
	);
};
export const CustomerNote = () => {
	return (
		<Card className="p-0 shadow">
			<Flex
				p="4"
				justify="between"
				align="center"
				className="border-b border-border"
			>
				<Heading size="3" className="text-accent-11">
					Памятка от покупателя
				</Heading>
			</Flex>
			<Box p="4">
				<Text color="gray" size="2">
					Покупатель ничего не оставил.
				</Text>
			</Box>
		</Card>
	);
};
