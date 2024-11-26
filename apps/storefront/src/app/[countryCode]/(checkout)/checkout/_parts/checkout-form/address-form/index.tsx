"use client";
import Input from "@/components/shared/input";
import Heading from "@/components/shared/typography/heading";
import type { DeliveryCheckoutForm } from "@blazzing-app/validators";
import { useFormContext } from "react-hook-form";

export function AddressForm() {
	return (
		<div className="flex flex-col gap-8 border-t border-accent py-8">
			<div className="flex items-center justify-between">
				<Heading desktopSize="xs" font="sans" mobileSize="xs" tag="h6">
					Адрес доставки
				</Heading>
			</div>
			<div className="flex flex-col gap-4">
				<div className="grid gap-4 lg:grid-cols-2">
					<CustomerInputs />
				</div>
				<div className="grid gap-4 lg:grid-cols-2">
					<AddressInputs />
				</div>
			</div>
		</div>
	);
}

function CustomerInputs() {
	const { register, formState, clearErrors } =
		useFormContext<DeliveryCheckoutForm>();
	return (
		<>
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
					required
				/>
				<p className="text-red-500">{formState.errors.phone?.message}</p>
			</div>
		</>
	);
}

function AddressInputs() {
	const { register, formState, clearErrors } =
		useFormContext<DeliveryCheckoutForm>();

	return (
		<>
			<div className="grid gap-2">
				<Input
					{...register("shippingAddress.line1")}
					placeholder="Улица"
					required
					onChange={(e) => {
						register("shippingAddress.line1").onChange(e);
						clearErrors();
					}}
				/>
				<p className="text-red-500">
					{formState.errors.shippingAddress?.line1?.message}
				</p>
			</div>

			<div className="grid gap-2">
				<Input
					placeholder="Город"
					{...register("shippingAddress.city")}
					onChange={(e) => {
						register("shippingAddress.city").onChange(e);
						clearErrors();
					}}
					required
				/>
				<p className="text-red-500">
					{formState.errors.shippingAddress?.city?.message}
				</p>
			</div>
		</>
	);
}
