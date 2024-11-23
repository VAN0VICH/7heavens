import type { Replicache } from "replicache";
import { create } from "zustand";
import type {
	StorefrontMutators,
	StorefrontMutatorsType,
} from "@blazzing-app/replicache";

interface ReplicacheState {
	storeRep: Replicache<StorefrontMutatorsType> | null;
	setStoreRep: (rep: Replicache<StorefrontMutatorsType> | null) => void;
}

export const useReplicache = create<ReplicacheState>((set) => ({
	storeRep: null,
	setStoreRep: (rep) => set({ storeRep: rep }),
}));
