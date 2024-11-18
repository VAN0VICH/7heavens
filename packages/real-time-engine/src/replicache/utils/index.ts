export function cleanHandle(handle: string | undefined) {
	if (!handle) {
		return undefined;
	}
	// Removes non-printable characters, trims whitespace, and converts to lowercase
	return (
		handle
			// biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
			.replace(/[\u200B-\u200D\uFEFF]/g, "")
			.trim()
			.toLowerCase()
	);
}
