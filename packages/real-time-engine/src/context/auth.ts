import { Context } from "effect";

class AuthContext extends Context.Tag("Database")<
	AuthContext,
	{
		readonly authUser: { id: string } | null;
	}
>() {}

export { AuthContext };
