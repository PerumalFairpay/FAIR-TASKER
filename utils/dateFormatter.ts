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

export function format(
  date: Date | string | number | undefined | null,
  formatStr: string
): string {
  if (!date) return "";

  // If it's a naive ISO datetime string (e.g. "2026-07-25T08:32:09" or "2026-07-25"), 
  // parse and format it directly as local to preserve the wall-clock time.
  if (typeof date === "string") {
    const hasOffset = date.includes("Z") || /T.*[+-]\d{2}/.test(date);
    if (!hasOffset) {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      return dateFnsFormat(d, formatStr);
    }
  }

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
