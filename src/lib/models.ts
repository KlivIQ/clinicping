/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Domain models. Mirror supabase/schema.sql 1:1 (camelCase here, snake_case in DB)
 * so a real backend can replace src/lib/mock-data.ts without UI changes.
 */

export type Lang = "en" | "ta";
export type AppointmentSource = "whatsapp" | "manual";
export type AppointmentStatus = "booked" | "arrived" | "done" | "no_show" | "cancelled";
export type RiskLevel = "high" | "medium" | "low";
export type ReminderState = "queued" | "sent" | "delivered" | "confirmed" | "no_reply" | "failed" | "reschedule_requested" | "cancel_requested";
export type ReminderOffset = "24h" | "2h";
export type SlotMinutes = 10 | 15 | 20 | 30;
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Doctor {
  id: string;
  fullName: string;
  phone: string; // E.164, e.g. +919840012345
  preferredLang: Lang;
  createdAt: string;
}

export interface Practice {
  id: string;
  ownerId: string;
  name: string;
  address?: string;
  city?: string;
  registrationNo?: string;
  logoUrl?: string;
  slotMinutes: number;
  defaultFeeInr: number;
  whatsappConnected: boolean;
  createdAt: string;
}

export interface WorkingHours {
  id: string;
  practiceId: string;
  weekday: Weekday;
  opensAt: string; // "09:00"
  closesAt: string; // "13:00"
}

export interface TimeBlock {
  id: string;
  practiceId: string;
  startsAt: string; // ISO
  endsAt: string;
  reason?: string;
  isDayOff: boolean;
}

export interface Patient {
  id: string;
  practiceId: string;
  fullName: string;
  phone: string;
  preferredLang: Lang;
  visitCount: number;
  noShowCount: number;
  createdAt: string;
}

export interface Appointment {
  id: string;
  practiceId: string;
  patientId: string;
  startsAt: string; // ISO
  durationMinutes: number;
  source: AppointmentSource;
  status: AppointmentStatus;
  riskLevel: RiskLevel;
  riskReasonKey: string; // i18n key — never a raw score
  feeInr: number;
  bookedAt: string;
}

export interface Reminder {
  id: string;
  appointmentId: string;
  channel: "whatsapp" | "sms";
  lang: Lang;
  state: ReminderState;
  offset?: ReminderOffset; // which automatic reminder: 24 h or 2 h before the visit
  scheduledFor?: string; // ISO, when the reminder is due
  sentAt?: string;
  updatedAt: string;
  isManual: boolean;
}

export interface StaffInvite {
  id: string;
  practiceId: string;
  name: string;
  phone: string;
  role: "assistant";
  createdAt: string;
}

/** One opening window per weekday; `closed` hides the whole day. */
export interface DayHours {
  weekday: Weekday;
  opensAt: string; // "09:00"
  closesAt: string; // "20:00"
  closed: boolean;
}

/** Repeats every open day, e.g. lunch 13:00–14:00. */
export interface DailyBreak {
  id: string;
  startsAt: string; // "13:00"
  endsAt: string;
}

/** Inclusive local date range, "YYYY-MM-DD". A single day has from === to. */
export interface DayOff {
  id: string;
  from: string;
  to: string;
}

/** Everything editable on the Settings screen. */
export interface ClinicSettings {
  practiceName: string;
  address?: string;
  registrationNo?: string;
  hours: DayHours[];
  slotMinutes: SlotMinutes;
  defaultFeeInr: number;
  defaultReminderLang: Lang;
  breaks: DailyBreak[];
  daysOff: DayOff[];
  whatsappConnected: boolean;
  staffInvites: StaffInvite[];
}
