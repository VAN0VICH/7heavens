import type { ColumnDef } from "@tanstack/react-table";

import {
	orderPaymentStatuses,
	orderStatuses,
	orderTypes,
	type StoreOrder,
} from "@blazzing-app/validators";
import { Flex, Heading } from "@radix-ui/themes";
import { OrderStatus } from "~/components/badge/order-status";
import { OrderType } from "~/components/badge/order-type";
import { PaymentStatus } from "~/components/badge/payment-status";
import Price from "~/components/price";
import { DataTableColumnHeader } from "~/components/templates/table/data-table-column-header";
import type { DataTableFilterableColumn } from "~/types/table";
import { formatISODate } from "~/utils/format";

export function getOrdersColumns(): ColumnDef<StoreOrder, unknown>[] {
	return [
		{
			accessorKey: "displayId",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					className="w-full flex justify-center"
					title="Номер заказа"
				/>
			),
			cell: ({ row }) => {
				return (
					<Heading size="7" className="w-full flex font-freeman justify-center">
						{row.original.displayId}
					</Heading>
				);
			},

			enableSorting: true,
			enableHiding: false,
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Статус" />
			),
			cell: ({ row }) => {
				const status = row.original.status;

				if (!status) {
					return null;
				}

				return (
					<Flex width="100px" align="center">
						<OrderStatus status={status} size="3" />
					</Flex>
				);
			},
			filterFn: (row, id, value) => {
				return Array.isArray(value) && value.includes(row.getValue(id));
			},
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "paymentStatus",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Оплата" />
			),
			cell: ({ row }) => {
				const status = row.original.paymentStatus;

				if (!status) {
					return null;
				}

				return (
					<Flex width="100px" align="center">
						<PaymentStatus status={status} size="3" />
					</Flex>
				);
			},
			filterFn: (row, id, value) => {
				return Array.isArray(value) && value.includes(row.getValue(id));
			},
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "type",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Тип" />
			),
			cell: ({ row }) => {
				const type = row.original.type;

				if (!type) {
					return null;
				}

				return (
					<Flex width="100px" align="center">
						<OrderType type={type} size="3" />
					</Flex>
				);
			},
			filterFn: (row, id, value) => {
				return Array.isArray(value) && value.includes(row.getValue(id));
			},
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "Date",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Дата" />
			),
			cell: ({ row }) => {
				return (
					<div className="w-[80px]">
						{formatISODate(row.original.createdAt)}
					</div>
				);
			},

			enableSorting: true,
			enableHiding: false,
		},
		{
			accessorKey: "Total",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					className="w-full flex justify-center"
					title="Сумма"
				/>
			),
			cell: ({ row }) => {
				return (
					<Heading size="4" className="w-full font-freeman flex justify-center">
						<Price
							amount={row.original.total ?? -1}
							currencyCode={row.original.currencyCode}
						/>
					</Heading>
				);
			},

			enableSorting: true,
			enableHiding: false,
		},
	];
}
export const filterableColumns: DataTableFilterableColumn<StoreOrder>[] = [
	{
		id: "status",
		title: "Cтатус",
		options: orderStatuses.map((status) => ({
			label: status[0]?.toUpperCase() + status.slice(1),
			value: status,
		})),
	},
	{
		id: "paymentStatus",
		title: "Оплата",
		options: orderPaymentStatuses.map((status) => ({
			label: status[0]?.toUpperCase() + status.slice(1),
			value: status,
		})),
	},
	{
		id: "type",
		title: "Тип",
		options: orderTypes.map((status) => ({
			label: status[0]?.toUpperCase() + status.slice(1),
			value: status,
		})),
	},
];
