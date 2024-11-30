import { flexRender, type ColumnDef, type Row } from "@tanstack/react-table";
import React, { useMemo } from "react";

import type { StoreOrder } from "@blazzing-app/validators";
import { Flex, Heading, Separator, Spinner } from "@radix-ui/themes";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DataTableToolbar } from "~/components/templates/table/data-table-toolbar";
import { useDataTable } from "~/components/templates/table/use-data-table";
import type { DebouncedFunc } from "~/types/debounce";
import { cn } from "~/ui";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/ui/table";
import { useDashboardStore } from "~/zustand/store";
import { filterableColumns, getOrdersColumns } from "./columns";

interface OrdersTableProps {
	orders: StoreOrder[];
	setOrderID: (id: string | undefined) => void;
	orderID?: string | undefined;
	toolbar?: boolean;
	onSearch?: DebouncedFunc<(value: string) => void>;
	toolbarButton?: React.ReactNode;
}

function OrdersTable({
	orders,
	setOrderID,
	orderID,
	toolbar = true,
	onSearch,
	toolbarButton,
}: Readonly<OrdersTableProps>) {
	const isInitialized = useDashboardStore((state) => state.isInitialized);
	const columns = useMemo<ColumnDef<StoreOrder>[]>(
		() => getOrdersColumns(),
		[],
	);
	const table = useDataTable({
		columns,
		data: orders,
	});

	const { rows } = table.getRowModel();

	const parentRef = React.useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 50,
		overscan: 20,
	});

	return (
		<div className="max-w-7xl w-full">
			{toolbar && (
				<DataTableToolbar
					className="px-4 pb-4"
					viewOptions={false}
					table={table}
					filterableColumns={filterableColumns}
					{...(onSearch && { onSearch })}
					toolbarButton={toolbarButton}
				/>
			)}
			{/* {dashboardRep?.online && ( */}

			{/* )} */}

			<div ref={parentRef} className="h-[84vh] relative overflow-x-scroll px-4">
				<div style={{ height: `${virtualizer.getTotalSize()}px` }}>
					<Table>
						<TableHeader className="w-full sticky top-0 bg-component z-40">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}

							<Separator className="absolute top-10 bg-border" />
						</TableHeader>
						<TableBody className="px-4">
							{rows.length ? (
								virtualizer.getVirtualItems().map((virtualRow, index) => {
									const row = rows[virtualRow.index] as Row<StoreOrder>;
									return (
										<TableRow
											key={row.id}
											data-state={row.original.id === orderID && "selected"}
											onClick={() => {
												setOrderID(row.original.id);
											}}
											style={{
												height: `${virtualRow.size + 20}px`,
												transform: `translateY(${
													virtualRow.start - index * virtualRow.size
												}px)`,
											}}
											className={cn("bg-component", {
												"opacity-50":
													row.original.status === "completed" ||
													row.original.status === "cancelled",
												"border-x-2 border-x-yellow-9":
													row.original.status === "pending",
												"border-x-2 border-x-gray-7":
													row.original.status === "cancelled",
												"border-x-2 border-x-green-7":
													row.original.status === "processing" ||
													row.original.status === "completed",
											})}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									);
								})
							) : (
								<TableRow className="border-none h-full hover:bg-transparent">
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										<Flex align="center" py="4" direction="column" gap="4">
											{!isInitialized ? (
												<Spinner />
											) : (
												<Heading
													size="3"
													className="   text-accent-11 tracking-tight"
												>
													Нет заказов
												</Heading>
											)}
										</Flex>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
			{/* <DataTablePagination
				table={table}
				className="p-4 border-t border-border"
			/> */}
		</div>
	);
}

export { OrdersTable };
