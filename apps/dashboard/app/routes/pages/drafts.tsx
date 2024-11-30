import {
	Button,
	Card,
	Dialog,
	Flex,
	Heading,
	IconButton,
	ScrollArea,
} from "@radix-ui/themes";
import React from "react";
import { Icons } from "~/ui/icons";
import { useReplicache } from "~/zustand/replicache";
import { useDashboardStore } from "~/zustand/store";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export const OrderDrafts = ({
	setDraftOrderID,
}: {
	setDraftOrderID: (id: string | undefined, isAlreadyCreated?: boolean) => void;
}) => {
	const orderDrafts = useDashboardStore((state) => state.draftOrders);
	const [opened, setOpened] = React.useState(false);
	const count = orderDrafts.length;
	const rep = useReplicache((state) => state.dashboardRep);
	const deleteOrder = React.useCallback(
		async (id: string[]) => {
			await rep?.mutate.deleteOrder({
				keys: id,
			});
		},
		[rep],
	);
	const [parent] = useAutoAnimate(/* optional config */);

	return (
		<Dialog.Root open={opened} onOpenChange={setOpened}>
			<Dialog.Trigger>
				<Flex
					direction="column"
					justify="center"
					position="relative"
					className="size-[60px]"
				>
					<IconButton variant="surface" size="4">
						<Icons.Info />
					</IconButton>
					<div className="size-6 text-white text-sm absolute top-0 right-0 flex justify-center items-center rounded-full bg-red-500">
						{count}
					</div>
				</Flex>
			</Dialog.Trigger>
			<Dialog.Content
				className="md:min-w-[95vw] min-h-[90vh] relative bg-accent-2 p-0"
				maxWidth="95vw"
			>
				<Dialog.Title
					align="center"
					className="py-4 text-xl bg-component border-b-2 border-accent-7"
				>
					Архив
				</Dialog.Title>
				<ScrollArea className="min-h-[600px]" scrollbars="vertical">
					<Flex gap="2" className="h-full p-4  flex-wrap" ref={parent}>
						{orderDrafts.map((o) => (
							<Card
								key={o.id}
								onClick={() => setDraftOrderID(o.id, true)}
								className="min-w-[200px] relative flex items-center justify-center min-h-[200px] aspect-square"
							>
								<Heading>{`Заказ: ${o.displayId}`}</Heading>

								<IconButton
									onClick={async (e) => {
										e.preventDefault();
										e.stopPropagation();
										await deleteOrder([o.id]);
									}}
									variant="surface"
									color="red"
									className="absolute top-2 right-2"
								>
									<Icons.Trash className="size-4" />
								</IconButton>
							</Card>
						))}
					</Flex>
				</ScrollArea>

				<Flex
					gap="3"
					justify="between"
					p="3"
					className="bg-component absolute bottom-0 w-full border-t-2 border-accent-7"
				>
					<Dialog.Close>
						<Button variant="soft" color="gray" size="4">
							Закрыть
						</Button>
					</Dialog.Close>
					<Button
						variant="surface"
						color="red"
						size="4"
						onClick={async () =>
							await deleteOrder(orderDrafts.map((o) => o.id))
						}
					>
						<Icons.Trash className="size-4" />
						Очистить
					</Button>
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
};
