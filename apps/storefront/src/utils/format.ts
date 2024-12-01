import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { StoreOrder } from "@blazzing-app/validators";
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

/**
 * Sort orders by prioritizing status ('completed' and 'cancelled' at the bottom),
 * and sorting by the freshest date within each group.
 *
 * @param {Array} orders - Array of order objects.
 * @param {string} statusKey - The key for the status property in the order object.
 * @param {string} dateKey - The key for the date property in the order object.
 * @returns {Array} - Sorted array of orders.
 */
export function sortOrders(orders: StoreOrder[]) {
	return orders.sort((a, b) => {
		// Determine priority based on status
		const statusA =
			a.status === "completed" || a.status === "cancelled" ? 1 : 0;
		const statusB =
			b.status === "completed" || b.status === "cancelled" ? 1 : 0;

		// Sort by status priority
		if (statusA !== statusB) {
			return statusA - statusB; // 'completed' and 'cancelled' come last
		}

		// Sort by date within the same group
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});
}
