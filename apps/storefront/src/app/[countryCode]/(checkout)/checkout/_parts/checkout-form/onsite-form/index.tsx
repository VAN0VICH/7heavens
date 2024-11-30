"use client";
import Input from "@/components/shared/input";
import Heading from "@/components/shared/typography/heading";
import type { OnsiteCheckoutForm } from "@blazzing-app/validators";
import { useFormContext } from "react-hook-form";

export function OnsiteForm() {
	const { register, formState, clearErrors } =
		useFormContext<OnsiteCheckoutForm>();
	return (
		<div className="flex flex-col gap-8 border-t border-accent py-8">
			<div className="flex items-center justify-between">
				<Heading desktopSize="xs" font="sans" mobileSize="xs" tag="h6">
					На месте
				</Heading>
			</div>
			<div className="flex flex-col gap-4">
				<div className="grid gap-4 lg:grid-cols-2">
					<div className="grid gap-2">
						<Input
							{...register("fullName")}
							onChange={(e) => {
								register("fullName").onChange(e);
								clearErrors();
							}}
							placeholder="Имя"
							required
						/>
						<p className="text-red-500">{formState.errors.fullName?.message}</p>
					</div>
					<div className="grid gap-2">
						<Input
							{...register("tableNumber", {
								setValueAs: (value) =>
									value === "" ? undefined : Number(value),
							})}
							onChange={(e) => {
								register("tableNumber").onChange(e);
								clearErrors();
							}}
							type="number"
							placeholder="Номер столика"
							required
						/>
						<p className="text-red-500">{formState.errors.fullName?.message}</p>
					</div>
					<div className="grid gap-2">
						<Input
							{...register("email")}
							onChange={(e) => {
								register("email").onChange(e);
								clearErrors();
							}}
							placeholder="Электронная почта"
						/>
						<p className="text-red-500">{formState.errors.email?.message}</p>
					</div>
					<div className="grid gap-2">
						<Input
							{...register("phone")}
							onChange={(e) => {
								register("phone").onChange(e);
								clearErrors();
							}}
							placeholder="Мобильный телефон"
						/>
						<p className="text-red-500">{formState.errors.phone?.message}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
