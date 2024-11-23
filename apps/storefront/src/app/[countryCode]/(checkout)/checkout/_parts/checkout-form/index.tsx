"use client";
import Heading from "@/components/shared/typography/heading";

import Checkbox from "@/components/shared/checkbox";
import AddressForm from "./address-form";

export function CheckoutForm(
	// 	{
	// 	// paymentMethods,
	// 	// shippingMethods,
	// }: {
	// 	// paymentMethods: StorePaymentProvider[];
	// 	// shippingMethods: StoreCartShippingOption[];
	// }
	{
		type,
		setType,
	}: {
		type: "delivery" | "onsite";
		setType: React.Dispatch<React.SetStateAction<"delivery" | "onsite">>;
	},
) {
	return (
		<div className="w-full">
			<div className="w-full flex flex-wrap gap-6 md:gap-10 items-center">
				<div className="flex gap-3 items-center">
					<Checkbox
						checked={type === "delivery"}
						onCheckedChange={() => setType("delivery")}
					/>
					<p className="text-base md:text-lg font-medium whitespace-nowrap">
						Достaвка
					</p>
				</div>
				<div className="flex gap-3 items-center">
					<Checkbox
						checked={type === "onsite"}
						onCheckedChange={() => setType("onsite")}
					/>
					<p className="text-base md:text-lg font-medium whitespace-nowrap">
						На месте
					</p>
				</div>
			</div>
			<Heading desktopSize="2xl" font="serif" mobileSize="xl" tag="h3">
				Оформление заказа
			</Heading>
			<AddressForm />
			{/* {shippingMethods.length > 0 && (
					<Delivery
						active={step === "delivery"}
						cart={cart}
						currency_code={cart.currency_code}
						methods={shippingMethods}
						setStep={setStep}
					/>
				)} */}
		</div>
	);
}
