import { parseWithZod } from "@conform-to/zod";
import { useFetchers, useRouteLoaderData } from "@remix-run/react";
import type { RootLoaderData } from "~/root";
import { useHints } from "./use-hints";
import { PreferencesSchema, type Preferences } from "~/types/state";
export function useUserPreferences(): Preferences {
	const data = useRouteLoaderData<RootLoaderData>("root");
	const hints = useHints();
	const optimisticUpdates = useOptimisticUserPreferences();
	return {
		...(data?.requestInfo.preferences as Preferences),
		theme:
			optimisticUpdates?.theme ??
			data?.requestInfo.preferences.theme ??
			hints.theme,
		...(optimisticUpdates?.accentColor && {
			accentColor: optimisticUpdates.accentColor,
		}),
		...(optimisticUpdates?.grayColor && {
			grayColor: optimisticUpdates.grayColor,
		}),
		...(optimisticUpdates?.sidebarState && {
			sidebarState: optimisticUpdates.sidebarState,
		}),
	};
}

export function useOptimisticUserPreferences() {
	const fetchers = useFetchers();
	const preferences = fetchers.find(
		(f) => f.formAction === "/action/set-preferences",
	);
	if (preferences?.formData) {
		const submission = parseWithZod(preferences.formData, {
			schema: PreferencesSchema,
		});

		if (submission.status === "success") {
			return submission.value;
		}
	}
}
