import type { Auth, AuthSession } from "@blazzing-app/validators";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import type { WebEnv } from "~/types/env";
export const SESSION_KEY = "blazzing-session";

export const Authentication = ({
	env,
	sessionExpiresIn = new TimeSpan(30, "d"),
	sessionKey = SESSION_KEY,
}: {
	env: WebEnv;
	sessionExpiresIn?: TimeSpan;
	sessionKey?: string;
}) => {
	return {
		sessionKey,
		validateSession: async (sessionID: string) => {
			const response = await fetch(
				`${env.BLAZZING_URL}/auth/user-and-session?sessionID=${sessionID}`,
				{
					headers: {
						"x-publishable-key": env.BLAZZING_PUBLISHABLE_KEY,
					},
				},
			);
			const { session, user } = (await response.json()) as Auth;

			if (!session) {
				return { user: null, session: null };
			}

			const expirationDate = new Date(session.expiresAt);
			const activePeriodExpirationDate = new Date(
				expirationDate.getTime() - sessionExpiresIn.milliseconds() / 2,
			);

			if (!isWithinExpirationDate(expirationDate)) {
				await fetch(`${env.BLAZZING_URL}/auth/delete-session`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-publishable-key": env.BLAZZING_PUBLISHABLE_KEY,
					},
					body: JSON.stringify({ sessionID }),
				});
				return { user: null, session: null };
			}

			const currentSession: AuthSession = {
				...session,
				fresh: isWithinExpirationDate(activePeriodExpirationDate),
			};

			return { user, session: currentSession };
		},
		createSession: async (authID: string) => {
			const expiresAt = createDate(sessionExpiresIn);
			const response = await fetch(`${env.BLAZZING_URL}/auth/delete-session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-publishable-key": env.BLAZZING_PUBLISHABLE_KEY,
				},
				body: JSON.stringify({ authID, expiresAt: expiresAt.toISOString() }),
			});
			const session = (await response.json()) as AuthSession;

			return { ...session, fresh: true };
		},
		invalidateSession: (sessionID: string) => {
			return fetch(`${env.BLAZZING_URL}/auth/delete-session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-publishable-key": env.BLAZZING_PUBLISHABLE_KEY,
				},
				body: JSON.stringify({ sessionID }),
			});
		},
		deleteExpiredSessions: () => {
			return fetch(`${env.BLAZZING_URL}/auth/delete-expired-sessions`, {
				method: "POST",
				headers: {
					"x-publishable-key": env.BLAZZING_PUBLISHABLE_KEY,
				},
			});
		},
		readBearerToken: (authorizationHeader: string) => {
			const [authScheme, token] = authorizationHeader.split(" ") as [
				string,
				string | undefined,
			];
			if (authScheme !== "Bearer") {
				return null;
			}
			return token ?? null;
		},
	};
};
