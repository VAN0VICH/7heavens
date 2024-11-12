// sessions.server.tsx

import {
	createCookie,
	createCookieSessionStorage,
} from "@remix-run/cloudflare";
import type { Environment } from "~/types/other";

export const prefs = createCookie("prefs", { httpOnly: true, sameSite: "lax" });

export const userContext = createCookie("user_context", {
	httpOnly: true,
	sameSite: "lax",
});

export const getAuthSessionStorage = ({
	SESSION_SECRET = "WEAK_SECRET",
	ENVIRONMENT = "development",
}: {
	SESSION_SECRET?: string;
	ENVIRONMENT?: Environment;
}) =>
	createCookieSessionStorage({
		cookie: {
			name: "en_session",
			sameSite: "lax", // CSRF protection is advised if changing to 'none'
			path: "/",
			httpOnly: true,
			secrets: [SESSION_SECRET],
			secure: ENVIRONMENT === "production",
		},
	});
