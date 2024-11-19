"use client";
import type {
	StoreCart,
	StoreCartShippingOption,
	StorePaymentProvider,
} from "@medusajs/types";

import Heading from "@/components/shared/typography/heading";
import { useState } from "react";

import Checkbox from "@/components/shared/checkbox";
import AddressForm from "./address-form";
import Delivery from "./delivery";
import StripeWrapper from "./payment/wrapper";

export default function CheckoutForm({
	cart,
	paymentMethods,
	shippingMethods,
}: {
	cart: StoreCart;
	paymentMethods: StorePaymentProvider[];
	shippingMethods: StoreCartShippingOption[];
}) {
	const [step, setStep] = useState<
		"addresses" | "delivery" | "payment" | "review"
	>("addresses");

	return (
		<StripeWrapper cart={cart}>
			<div className="w-full">
				<div className="w-full flex flex-wrap gap-6 md:gap-10 items-center">
					<div className="flex gap-3 items-center">
						<Checkbox />
						<p className="text-base md:text-lg font-medium whitespace-nowrap">
							Достaвка
						</p>
					</div>
					<div className="flex gap-3 items-center">
						<Checkbox />
						<p className="text-base md:text-lg font-medium whitespace-nowrap">
							На месте
						</p>
					</div>
				</div>
				<Heading desktopSize="2xl" font="serif" mobileSize="xl" tag="h3">
					Оформление заказа
				</Heading>
				<AddressForm
					active={step === "addresses"}
					cart={cart}
					nextStep={shippingMethods.length > 0 ? "delivery" : "payment"}
					setStep={setStep}
				/>
				{shippingMethods.length > 0 && (
					<Delivery
						active={step === "delivery"}
						cart={cart}
						currency_code={cart.currency_code}
						methods={shippingMethods}
						setStep={setStep}
					/>
				)}
			</div>
		</StripeWrapper>
	);
}
