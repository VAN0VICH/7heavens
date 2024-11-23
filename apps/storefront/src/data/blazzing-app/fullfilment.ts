// import medusa from "./client";
// import { getCacheHeaders } from "./cookies";

// export const listCartShippingMethods = async (cartId: string) =>
// 	medusa.store.fulfillment
// 		.listCartOptions(
// 			{ cart_id: cartId },
// 			{ ...(await getCacheHeaders("fulfillment")) },
// 		)
// 		.then(({ shipping_options }) => shipping_options)
// 		.catch(() => {
// 			return null;
// 		});
