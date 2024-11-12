import type {
	WebEnv,
	WebBindings,
	AuthUser,
	AuthSession,
} from "@7heavens/validators";
import type { Session, SessionData } from "@remix-run/cloudflare";

declare module "@remix-run/cloudflare" {
	interface AppLoadContext {
		cloudflare: {
			env: WebEnv;
			bindings: WebBindings;
		};
		authUser: AuthUser | null;
		session: Session<SessionData, SessionData>;
		userSession: AuthSession;
	}
}
