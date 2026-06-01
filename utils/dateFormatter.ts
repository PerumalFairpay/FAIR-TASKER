import { format as dateFnsFormat } from "date-fns";
import { store } from "@/store/store";

/**
 * Retrieve company timezone from Redux store dynamically.
 */
export function getCompanyTimezone(): string {
  let timezone = "UTC";
  try {
    const state = store.getState();
    const settings = state.Settings?.settings || state.Settings?.publicSettings;
    if (settings) {
      for (const group of Object.keys(settings)) {
        const item = settings[group].find((s: any) => s.key === "company_timezone");
        if (item && item.value) {
          timezone = item.value;
          break;
        }
      }
    }
  } catch (e) {
    // Ignore store error
  }
  return timezone;
}

/**
 * Get a Date object whose local time represents the current time in the company's timezone.
 */
export function getCurrentDateInTimezone(): Date {
  const d = new Date();
  const timezone = getCompanyTimezone();
  try {
    const tzString = d.toLocaleString("en-US", { timeZone: timezone });
    return new Date(tzString);
  } catch (e) {
    return d;
  }
}

/**
 * Format a date string, number, or Date object into a target timezone.
 * Defaults to the globally configured company timezone from the Redux store.
 */
export function format(
  date: Date | string | number | undefined | null,
  formatStr: string
): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const timezone = getCompanyTimezone();

  try {
    const tzString = d.toLocaleString("en-US", { timeZone: timezone });
    const targetDate = new Date(tzString);
    return dateFnsFormat(targetDate, formatStr);
  } catch (e) {
    return dateFnsFormat(d, formatStr);
  }
}
