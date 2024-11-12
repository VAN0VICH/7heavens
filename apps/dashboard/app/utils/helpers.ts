export function getDomainUrl(request: Request) {
	const host =
		request.headers.get("X-Forwarded-Host") ??
		request.headers.get("host") ??
		new URL(request.url).host;
	const protocol = host.includes("localhost") ? "http" : "https";
	return `${protocol}://${host}`;
}
export function getErrorMessage(error: unknown) {
	if (typeof error === "string") return error;
	if (
		error &&
		typeof error === "object" &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return error.message;
	}
	console.error("Unable to get error message for error", error);
	return "Unknown Error";
}

export function toImageURL(
	base64: string | undefined,
	fileType: string | undefined,
) {
	if (base64 === undefined || fileType === undefined) return undefined;
	return `data:${fileType};base64,${base64}`;
}

export function isMacOs() {
	if (typeof window === "undefined") return false;

	return window.navigator.userAgent.includes("Mac");
}
export const isTouchDevice = () => {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

export const capitalize = (str: string | undefined) =>
	str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export const decapitalize = (str: string | undefined) =>
	str ? str.charAt(0).toLowerCase() + str.slice(1) : "";
