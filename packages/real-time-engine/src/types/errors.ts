import { Data } from "effect";
export class InvalidValue extends Data.TaggedError("InvalidValue")<{
	readonly message: string;
}> {}

export class NeonDatabaseError extends Data.TaggedError("NeonDatabaseError")<{
	readonly message: string;
}> {}

export class MedusaError extends Data.TaggedError("MedusaError")<{
	readonly message: string;
}> {}

export class NotFound extends Data.TaggedError("NotFound")<{
	readonly message: string;
}> {}

export class MutatorNotFoundError extends Data.TaggedError(
	"MutatorNotFoundError",
)<{
	readonly message: string;
}> {}
