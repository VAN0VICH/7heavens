"use client";

import { CartDetails } from "./_parts/cart-details";
import { CheckoutForm } from "./_parts/checkout-form";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/components/global/header/cart/cart-context";
import {
	DeliveryCheckoutFormSchema,
	OnsiteCheckoutFormSchema,
	type DeliveryCheckoutForm,
	type OnsiteCheckoutForm,
} from "@blazzing-app/validators";
import { client } from "@/data/blazzing-app/client";
import { env } from "@/app/env";
import React from "react";
import { useRouter } from "next/navigation";
import { Cta } from "@/components/shared/button";

export default function CheckoutPage() {
	const { cart, lineItems } = useCart();
	const [isLoading, setIsLoading] = React.useState(false);
	const [type, setType] = React.useState<"delivery" | "onsite">("delivery");
	const router = useRouter();

	// const shippingMethods = (await listCartShippingMethods(cart.id)) || [];
	// const paymentMethods = (await listCartPaymentMethods(cart.region_id!)) || [];

	const methods = useForm<OnsiteCheckoutForm | DeliveryCheckoutForm>({
		resolver: zodResolver(
			DeliveryCheckoutFormSchema.or(OnsiteCheckoutFormSchema),
		),
		defaultValues: {
			email: cart?.email ?? "",
			phone: cart?.phone ?? "",
			fullName: cart?.fullName ?? "",
			...(cart?.shippingAddress && {
				shippingAddress:
					cart?.shippingAddress as DeliveryCheckoutForm["shippingAddress"],
			}),
		},
	});
	const onSubmit = async (data: DeliveryCheckoutForm | OnsiteCheckoutForm) => {
		if (lineItems.length === 0 || !cart) {
			return;
		}

		setIsLoading(true);

		const response = await client.cart["complete-cart"].$post(
			{
				json: {
					checkoutInfo: data,
					id: cart.id,
					type,
				},
			},

			{
				headers: {
					"x-publishable-key": env.NEXT_PUBLIC_BLAZZING_PUBLISHABLE_KEY,
				},
			},
		);
		if (response.ok) {
			const { result: orderIDs } = await response.json();

			if (orderIDs.length > 0) {
				return router.push(
					`/order/confirmed?${orderIDs.map((id) => `id=${id}`).join("&")}`,
				);
			}
		}

		setIsLoading(false);
		return router.push("/error?error=Something wrong happened");
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<div className="w-full flex flex-col  max-w-max-screen">
					<section className="mx-auto flex w-full flex-col-reverse gap-8 px-4 py-8 md:flex-row md:gap-20 md:px-8 lg:justify-between lg:pb-20 lg:pt-5">
						<CheckoutForm setType={setType} type={type} />
						<div>
							<CartDetails />
							<Cta loading={isLoading} size="sm" type="submit">
								Оформить
							</Cta>
						</div>
					</section>
				</div>
			</form>
		</FormProvider>
	);
}
