import type { WriteTransaction } from "replicache";
import type { Server } from "..";
import { createCart, updateCart } from "./cart";
import { createLineItem, deleteLineItem, updateLineItem } from "./line-item";

export type StoreMutatorsType = {
	[key in keyof Server.StoreMutatorsType]: (
		ctx: WriteTransaction,
		args: Parameters<Server.StoreMutatorsType[key]>[0],
	) => Promise<void>;
};

export const StoreMutators: StoreMutatorsType = {
	createCart,
	createLineItem,
	deleteLineItem,
	updateCart,
	updateLineItem,
};
