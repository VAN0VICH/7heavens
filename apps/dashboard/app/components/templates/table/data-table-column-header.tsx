import {
	ArrowDownIcon,
	ArrowUpIcon,
	CaretSortIcon,
} from "@radix-ui/react-icons";
import type { Column } from "@tanstack/react-table";

import { Button, DropdownMenu } from "@radix-ui/themes";
import { cn } from "~/ui";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn("text-gray-11", className)}>{title}</div>;
	}

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button
						type="button"
						variant="ghost"
						size="2"
						className="-ml-3 rounded-none h-8 data-[state=open]:bg-accent"
					>
						<span>{title}</span>
						{column.getIsSorted() === "desc" ? (
							<ArrowDownIcon className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUpIcon className="ml-2 h-4 w-4" />
						) : (
							<CaretSortIcon className="ml-2 h-4 w-4" />
						)}
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="start" className="backdrop-blur-sm ">
					<DropdownMenu.Item
						onClick={() => column.toggleSorting(false)}
						className="hover:bg-accent-3 h-10 hover:text-accent-11 focus:bg-accent-3"
					>
						<ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Asc
					</DropdownMenu.Item>
					<DropdownMenu.Item
						onClick={() => column.toggleSorting(true)}
						className="hover:bg-accent-3 h-10 hover:text-accent-11 focus:bg-accent-3"
					>
						<ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Desc
					</DropdownMenu.Item>
					{/* <DropdownMenu.Item
						onClick={() => column.toggleVisibility(false)}
						className="hover:bg-accent-3 h-10 hover:text-accent-11 focus:bg-accent-3"
					>
						<EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Спрятать
					</DropdownMenu.Item> */}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	);
}
