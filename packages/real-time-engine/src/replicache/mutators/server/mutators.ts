import type { SpaceID, SpaceRecord } from "../../../types/replicache";
import { createCart, updateCart } from "./cart";
import { createLineItem, deleteLineItem, updateLineItem } from "./line-item";

export const StoreMutators = {
	createCart,
	updateCart,
	createLineItem,
	updateLineItem,
	deleteLineItem,
};
export const StoreMutatorsMap = new Map(Object.entries(StoreMutators));
export type StoreMutatorsType = typeof StoreMutators;
export type StoreMutatorsMapType = typeof StoreMutatorsMap;

type MutatorKeys = keyof StoreMutatorsType;
//affected spaces and its subspaces
export type AffectedSpaces = Record<
	MutatorKeys,
	Partial<Record<SpaceID, SpaceRecord[SpaceID]>>
>;

export const affectedSpaces: AffectedSpaces = {
	createCart: {
		store: ["cart"],
	},
	createLineItem: {
		store: ["cart"],
	},
	deleteLineItem: {
		store: ["cart"],
	},
	updateCart: {
		store: ["cart"],
	},
	updateLineItem: {
		store: ["cart"],
	},
};
