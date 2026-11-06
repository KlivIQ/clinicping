/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Clock formatting. Tamil uses a period-of-day word instead of am/pm ("மாலை 5:30"),
 * so templates read "{time} மணிக்கு" → "மாலை 5:30 மணிக்கு".
 */
import type { Lang } from "./models";

// NEEDS NATIVE REVIEW — period-of-day words and their hour boundaries.
export function tamilPeriod(hour: number): string {
  if (hour >= 4 && hour < 6) return "அதிகாலை";
  if (hour >= 6 && hour < 12) return "காலை";
  if (hour >= 12 && hour < 16) return "மதியம்";
  if (hour >= 16 && hour < 19) return "மாலை";
  return "இரவு";
}

/** "HH:MM" (24 h) → "9:30 am" or "காலை 9:30". */
export function formatClock(hhmm: string, lang: Lang): string {
  const h = Number(hhmm.split(":")[0]);
  const m = hhmm.split(":")[1] ?? "00";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return lang === "ta" ? `${tamilPeriod(h)} ${h12}:${m}` : `${h12}:${m} ${h < 12 ? "am" : "pm"}`;
}

/** ISO timestamp → local clock in the given language. */
export function formatTime(iso: string, lang: Lang): string {
  const d = new Date(iso);
  return formatClock(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`, lang);
}
