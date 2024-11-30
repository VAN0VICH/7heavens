import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export function formatISODate(
	isoDateString: string | undefined | null,
): string {
	if (!isoDateString) return "";
	return dayjs(isoDateString)
		.tz("Europe/Minsk") // Convert to Minsk timezone
		.format("DD/MM/YY HH:mm:ss"); // Format as desired
}
