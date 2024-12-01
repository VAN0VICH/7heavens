"use client";

import { env } from "@/app/env";
import { useCart } from "@/components/global/header/cart/cart-context";
import { Cta } from "@/components/shared/button";
import { client } from "@/data/blazzing-app/client";
import {
	DeliveryCheckoutFormSchema,
	OnsiteCheckoutFormSchema,
	type DeliveryCheckoutForm,
	type OnsiteCheckoutForm,
} from "@blazzing-app/validators";
import { useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { CartDetails } from "./cart-details";
import { CheckoutForm } from "./checkout-form";

export function CheckoutPageComponent({
	tempUserID,
}: { tempUserID: string | undefined }) {
	const { cart, lineItems } = useCart();
	const [isLoading, setIsLoading] = React.useState(false);
	const [type, setType] = React.useState<"delivery" | "onsite">("onsite");
	const router = useRouter();

	// const shippingMethods = (await listCartShippingMethods(cart.id)) || [];
	// const paymentMethods = (await listCartPaymentMethods(cart.region_id!)) || [];

	const methods = useForm<OnsiteCheckoutForm | DeliveryCheckoutForm>({
		defaultValues: {
			email: cart?.email ?? undefined,
			phone: cart?.phone ?? undefined,
			fullName: cart?.fullName ?? "",
			...(cart?.shippingAddress && {
				shippingAddress:
					cart?.shippingAddress as DeliveryCheckoutForm["shippingAddress"],
			}),
		},
	});
	const onSubmit = async () => {
		const values = methods.getValues();
		const actualValues = {
			fullName: values.fullName,
			...(values.phone && { phone: values.phone }),
			...(values.email && { email: values.email }),
			...("shippingAddress" in values &&
				values.shippingAddress && {
					shippingAddress: values.shippingAddress,
				}),
			...("tableNumber" in values &&
				values.tableNumber && {
					tableNumber: values.tableNumber,
				}),
		};

		if (type === "onsite") {
			const parsedValues = OnsiteCheckoutFormSchema.safeParse(actualValues);
			if (!parsedValues.success) {
				// Extract errors from Zod validation
				const zodErrors = parsedValues.error.formErrors.fieldErrors;

				// Set errors in React Hook Form
				// biome-ignore lint/complexity/noForEach: input size is not that long.
				Object.entries(zodErrors).forEach(([fieldName, messages]) => {
					if (messages) {
						methods.setError(fieldName as keyof OnsiteCheckoutForm, {
							type: "validation",
							message: messages.join(", "), // Combine multiple error messages
						});
					}
				});
				return;
			}
		} else {
			const parsedValues = DeliveryCheckoutFormSchema.safeParse(actualValues);
			if (!parsedValues.success) {
				// Extract errors from Zod validation
				const zodErrors = parsedValues.error.formErrors.fieldErrors;

				// Set errors in React Hook Form
				// biome-ignore lint/complexity/noForEach: input size is not that long.
				Object.entries(zodErrors).forEach(([fieldName, messages]) => {
					if (messages) {
						methods.setError(fieldName as keyof OnsiteCheckoutForm, {
							type: "validation",
							message: messages.join(", "), // Combine multiple error messages
						});
					}
				});
				return;
			}
		}

		if (lineItems.length === 0 || !cart) {
			return;
		}

		setIsLoading(true);

		const response = await client.cart["complete-cart"].$post(
			{
				json: {
					checkoutInfo: actualValues,
					id: cart.id,
					type,
				},
			},

			{
				headers: {
					"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
					...(tempUserID && { "x-temp-user-id": tempUserID }),
				},
			},
		);
		if (response.ok) {
			const { result: orderIDs } = await response.json();

			if (orderIDs.length > 0) {
				return router.push(`/order/confirmed/${orderIDs[0]}`);
			}
		}

		setIsLoading(false);
		return router.push("/error?error=Something wrong happened");
	};

	return (
		<FormProvider {...methods}>
			<div className="w-full flex flex-col  max-w-max-screen">
				<section className="mx-auto flex w-full max-w-5xl flex-col-reverse gap-8 px-4 py-8 md:flex-row md:gap-20 md:px-8 lg:justify-between lg:pb-20 lg:pt-5">
					<div>
						<CheckoutForm setType={setType} type={type} />
						<Cta
							disabled={type === "delivery"}
							loading={isLoading}
							size="lg"
							className="w-full"
							type="submit"
							onClick={onSubmit}
						>
							{type === "delivery" ? "Временно недоступно" : "Оформить"}
						</Cta>
					</div>
					<CartDetails />
				</section>
			</div>
		</FormProvider>
	);
}
