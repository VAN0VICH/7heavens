import { CheckIcon } from "@radix-ui/react-icons";
import type { Column, Table } from "@tanstack/react-table";
import type * as React from "react";

import {
	Badge,
	Button,
	Flex,
	IconButton,
	Popover,
	Text,
} from "@radix-ui/themes";
import { translation } from "~/constants";
import { cn } from "~/ui";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "~/ui/command";
import { Icons } from "~/ui/icons";

interface DataTableFacetedFilterProps<TData, TValue> {
	column: Column<TData, TValue> | undefined;
	title?: string;
	options: {
		label: string;
		value: string;
		icon?: React.ComponentType<{ className?: string }>;
	}[];
	table: Table<TData>;
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options,
	table,
}: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues();
	const selectedValues = new Set(column?.getFilterValue() as string[]);
	const isFiltered = table.getState().columnFilters.length > 0;

	return (
		<Popover.Root>
			<Popover.Trigger>
				<Button variant={"outline"} size="3">
					<Flex align="center">
						<Text className="font-body font-normal text-sm h-9 flex items-center">
							{title}
						</Text>
						{selectedValues?.size > 0 && (
							<Flex className="h-9 flex flex-col justify-center px-1">
								<div className="hidden space-x-1 lg:flex">
									{selectedValues.size > 2 ? (
										<Badge color={"orange"} variant="solid" size="3">
											{selectedValues.size} выбран
										</Badge>
									) : (
										options
											.filter((option) => selectedValues.has(option.value))
											.map((option) => (
												<Badge
													key={option.value}
													color={"orange"}
													variant="solid"
													size="3"
												>
													{
														translation[
															(option.label?.toLowerCase() as keyof typeof translation) ??
																("" as keyof typeof translation)
														]
													}
												</Badge>
											))
									)}
								</div>
							</Flex>
						)}
					</Flex>
					{isFiltered && (
						<IconButton
							variant="ghost"
							onClick={(e) => {
								e.stopPropagation();
								table.resetColumnFilters();
							}}
							size="3"
						>
							<Icons.Close className="min-w-4 max-w-4 min-h-4 max-h-4" />
						</IconButton>
					)}
				</Button>
			</Popover.Trigger>
			<Popover.Content className="w-[200px] p-0" align="start">
				<Command>
					<CommandList>
						<CommandEmpty>Ничего не нашлось.</CommandEmpty>
						<CommandGroup>
							{options.map((option) => {
								const isSelected = selectedValues.has(option.value);
								return (
									<CommandItem
										key={option.value}
										className="hover:bg-accent-3 h-14 hover:text-accent-11 focus:bg-accent-3 group"
										onSelect={() => {
											if (isSelected) {
												selectedValues.delete(option.value);
											} else {
												selectedValues.add(option.value);
											}
											const filterValues = Array.from(selectedValues);
											column?.setFilterValue(
												filterValues.length ? filterValues : undefined,
											);
										}}
									>
										<div
											className={cn(
												"mr-2 flex h-6 w-6 items-center justify-center border group-hover:border-accent-9 border-gray-11 rounded-[3px]",
												isSelected
													? "bg-accent-9 text-accent-11 border-accent-10"
													: "opacity-50 [&_svg]:invisible",
											)}
										>
											<CheckIcon className={cn("h-6 w-6  text-white")} />
										</div>
										{option.icon && <option.icon className="mr-2 h-4 w-4" />}
										<span className="text-base">
											{
												translation[
													(option.label?.toLowerCase() as keyof typeof translation) ??
														("" as keyof typeof translation)
												]
											}
										</span>
										{facets?.get(option.value) && (
											<span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-base">
												{facets.get(option.value)}
											</span>
										)}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className="justify-center text-center rounded-b-[7px]"
									>
										Очистить
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</Popover.Content>
		</Popover.Root>
	);
}
