import type { SpaceID, SpaceRecord } from "../../../types/replicache";
import { ordersCVD } from "./dashboard/orders";
import { cartCVD } from "./store/cart";
import { productsCVD } from "./store/products";
import { regionCVD } from "./store/region";
import type { GetRows } from "./types";

export type SpaceRecordGetterType = {
	[K in SpaceID]: Record<SpaceRecord[K][number], GetRows>;
};
export const SpaceRecordGetter: SpaceRecordGetterType = {
	dashboard: {
		orders: ordersCVD,
	},
	store: {
		cart: cartCVD,
		region: regionCVD,
		products: productsCVD,
	},
};
