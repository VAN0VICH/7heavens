import { getTempUserID } from "@/data/blazzing-app/cookies";
import { CheckoutPageComponent } from "./_parts/checkout-page";

export default async function CheckoutPage() {
	const tempUserID = await getTempUserID();
	return <CheckoutPageComponent tempUserID={tempUserID} />;
}
