import { DownloadIcon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";
import * as React from "react";

import { Box, Button, Card, Flex, Kbd, Tooltip } from "@radix-ui/themes";

interface DataTableFloatingBarProps<TData extends { id: string }> {
	table: Table<TData>;
}

export function DataTableFloatingBar<TData extends { id: string }>({
	table,
}: DataTableFloatingBarProps<TData>) {
	// Clear selection on Escape key press
	React.useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				table.toggleAllRowsSelected(false);
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [table]);

	return (
		<Flex className="fixed left-1/2 -translate-x-1/2 bottom-20 lg:bottom-10 rounded-lg z-30 w-fit">
			<Box className="w-full overflow-x-auto">
				<Card className="flex items-center gap-6 shadow-2xl px-4">
					<Tooltip content="Export" delayDuration={250}>
						<Button variant="ghost" size="3">
							<DownloadIcon aria-hidden="true" fontSize={15} />
							<Kbd>E</Kbd>
						</Button>
					</Tooltip>
				</Card>
			</Box>
		</Flex>
	);
}
