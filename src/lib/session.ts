/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * UI-only mock session (localStorage). Swap for real phone-OTP auth later.
 */
import { DEMO_OTP, DEMO_PHONE } from "./mock-data";

export type Session = { phone: string; name?: string };
const KEY = "cp.session";

export const isValidPhone = (p: string) => /^[6-9]\d{9}$/.test(p.replace(/\D/g, ""));
export const verifyOtp = (_phone: string, otp: string) => otp === DEMO_OTP;
export const isDemo = (phone: string) => phone === DEMO_PHONE;

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}
export function saveSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
export function clearSession() {
  localStorage.removeItem(KEY);
}
