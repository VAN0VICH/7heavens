import medusa from "./client";
import { getAuthHeaders, getCacheHeaders } from "./cookies";

export const getCustomer = async () => {
	"use cache";

	return await medusa.store.customer
		.retrieve(
			{},
			{
				...(await getCacheHeaders("customers")),
				...(await getAuthHeaders()),
			},
		)
		.then(({ customer }) => customer)
		.catch(() => null);
};
