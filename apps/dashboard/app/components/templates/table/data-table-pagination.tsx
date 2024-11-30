import type { Table } from "@tanstack/react-table";

import { Box, Flex, IconButton, Select, Text } from "@radix-ui/themes";
import { cn } from "~/ui";
import { Icons, strokeWidth } from "~/ui/icons";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	className?: string;
	pageSizes?: number[];
}

export function DataTablePagination<TData>({
	table,
	className,
	pageSizes = [100, 200, 300],
}: DataTablePaginationProps<TData>) {
	return (
		<Flex align="center" justify="center" px="2" className={cn(className)}>
			<Box className="hidden md:block text-sm text-muted-foreground">
				<Text color="gray" size="2">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</Text>
			</Box>
			<Flex align="center" justify="between" width="100%">
				<Flex align="center" gap="2">
					<Text className="hidden sm:block" color="gray" size="2">
						Rows per page
					</Text>
					<Select.Root
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<Select.Trigger
							className="h-8 w-[70px] text-accent-11"
							variant="soft"
						>
							{table.getState().pagination.pageSize}
						</Select.Trigger>
						<Select.Content side="top" className="backdrop-blur-sm">
							{pageSizes.map((pageSize) => (
								<Select.Item key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</Select.Item>
							))}
						</Select.Content>
					</Select.Root>
				</Flex>
				<Flex className="text- gray-11">
					<Flex align="center" justify="center" width="100px">
						<Text size="2" color="gray">
							Page {table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount() === 0 ? 1 : table.getPageCount()}
						</Text>
					</Flex>
					<Flex align="center" className="space-x-2">
						<IconButton
							type="button"
							variant="soft"
							className="hidden lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<Icons.DoubleLeft
								size={16}
								strokeWidth={strokeWidth}
								className="text-accent-11"
							/>
						</IconButton>
						<IconButton
							type="button"
							variant="soft"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<Icons.Left
								size={16}
								strokeWidth={strokeWidth}
								className="text-accent-11"
							/>
						</IconButton>
						<IconButton
							type="button"
							variant="soft"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<Icons.Right
								size={16}
								strokeWidth={strokeWidth}
								className="text-accent-11"
							/>
						</IconButton>
						<IconButton
							type="button"
							variant="soft"
							className="hidden lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<Icons.DoubleRight
								size={16}
								strokeWidth={strokeWidth}
								className="text-accent-11"
							/>
						</IconButton>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
}
