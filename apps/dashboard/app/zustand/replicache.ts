import type { Replicache } from "replicache";
import { create } from "zustand";
import type { StorefrontDashboardMutatorsType } from "@blazzing-app/replicache";

interface ReplicacheState {
	dashboardRep: Replicache<StorefrontDashboardMutatorsType> | null;
	setDashboardRep: (
		rep: Replicache<StorefrontDashboardMutatorsType> | null,
	) => void;
}

export const useReplicache = create<ReplicacheState>((set) => ({
	dashboardRep: null,
	setDashboardRep: (rep) => set({ dashboardRep: rep }),
}));
