/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
export const LANDING_DELAY_MINUTES = 15;

export function previewTime(time: string, delayed: boolean): string {
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  const total = hour * 60 + minute + (delayed ? LANDING_DELAY_MINUTES : 0);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}