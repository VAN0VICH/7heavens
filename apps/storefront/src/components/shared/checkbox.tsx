"use client";
import type { CheckboxProps } from "@radix-ui/react-checkbox";

import { Indicator, Root } from "@radix-ui/react-checkbox";

import Icon from "./icon";

export default function Checkbox({
	checked,
	onCheckedChange,
}: Pick<CheckboxProps, "checked" | "onCheckedChange">) {
	return (
		<div className="flex items-center">
			<Root
				checked={checked}
				className="flex size-10 appearance-none items-center justify-center rounded border border-accent outline-none data-[state=checked]:bg-accent"
				onCheckedChange={onCheckedChange}
			>
				<Indicator>
					<Icon name="Checkbox" className="size-5" />
				</Indicator>
			</Root>
		</div>
	);
}
