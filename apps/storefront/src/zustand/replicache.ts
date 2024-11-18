import type { Replicache } from "replicache";
import { create } from "zustand";
import type { StoreMutatorsType } from "@7heavens/real-time-engine";

interface ReplicacheState {
	storeRep: Replicache<StoreMutatorsType> | null;
	setStoreRep: (rep: Replicache<StoreMutatorsType> | null) => void;
}

export const useReplicache = create<ReplicacheState>((set) => ({
	storeRep: null,
	setStoreRep: (rep) => set({ storeRep: rep }),
}));
