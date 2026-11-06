/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Seed data for a fictional Chennai practice. Replace with backend queries later.
 */
import type { Appointment, ClinicSettings, Doctor, Patient, Practice, Reminder, WorkingHours } from "./models";
import type { DemoState } from "./clinic-demo";
export { useClinicDemo } from './clinic-demo-context';
export function createClinicDemoState(): DemoState {
  return { appointments: appointments.map(a => ({ ...a })), patients: patients.map(p => ({ ...p })), reminders: reminders.map(r => ({ ...r })), consultationId: null, delayMinutes: 0, settings: structuredClone(defaultSettings) };
}

export const DEMO_PHONE = "9840012345";
export const DEMO_OTP = "123456";

const today = new Date();
const at = (h: number, m = 0) => {
  const d = new Date(today);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000).toISOString();

export const demoDoctor: Doctor = {
  id: "doc_1",
  fullName: "Ravi Kumar",
  phone: "+919840012345",
  preferredLang: "en",
  createdAt: daysAgo(30),
};

export const demoPractice: Practice = {
  id: "prc_1",
  ownerId: "doc_1",
  name: "Dr. Ravi Kumar",
  address: "12, Venkatnarayana Rd, T. Nagar",
  city: "Chennai",
  slotMinutes: 15,
  defaultFeeInr: 400,
  whatsappConnected: true,
  createdAt: daysAgo(30),
};

export const defaultHours: WorkingHours[] = ([1, 2, 3, 4, 5, 6] as const).flatMap((d) => [
  { id: `wh_${d}_am`, practiceId: "prc_1", weekday: d, opensAt: "09:00", closesAt: "13:00" },
  { id: `wh_${d}_pm`, practiceId: "prc_1", weekday: d, opensAt: "17:00", closesAt: "20:00" },
]);

export const patients: Patient[] = [
  ["Lakshmi Narayanan", "9841100001", "ta", 6, 0],
  ["Arjun Mehta", "9841100002", "en", 1, 0],
  ["Meenakshi Sundaram", "9841100003", "ta", 3, 2],
  ["Priya Raghavan", "9841100004", "en", 8, 0],
  ["Karthik Subramanian", "9841100005", "ta", 0, 0],
  ["Fathima Begum", "9841100006", "ta", 2, 1],
].map(([fullName, phone, lang, v, n], i) => ({
  id: `pat_${i + 1}`,
  practiceId: "prc_1",
  fullName: fullName as string,
  phone: `+91${phone}`,
  preferredLang: lang as Patient["preferredLang"],
  visitCount: v as number,
  noShowCount: n as number,
  createdAt: daysAgo(60),
}));

export const appointments: Appointment[] = [
  { id: "apt_1", patientId: "pat_1", startsAt: at(9, 0), source: "whatsapp", status: "done", riskLevel: "low", riskReasonKey: "risk.regular", bookedAt: daysAgo(1) },
  { id: "apt_2", patientId: "pat_2", startsAt: at(9, 30), source: "whatsapp", status: "booked", riskLevel: "high", riskReasonKey: "risk.firstVisitOld", bookedAt: daysAgo(6) },
  { id: "apt_3", patientId: "pat_3", startsAt: at(10, 15), source: "manual", status: "booked", riskLevel: "high", riskReasonKey: "risk.pastNoShows", bookedAt: daysAgo(3) },
  { id: "apt_4", patientId: "pat_4", startsAt: at(11, 0), source: "whatsapp", status: "booked", riskLevel: "low", riskReasonKey: "risk.confirmed", bookedAt: daysAgo(2) },
  { id: "apt_5", patientId: "pat_5", startsAt: at(17, 30), source: "manual", status: "booked", riskLevel: "medium", riskReasonKey: "risk.noReply", bookedAt: daysAgo(4) },
  { id: "apt_6", patientId: "pat_6", startsAt: at(18, 15), source: "whatsapp", status: "booked", riskLevel: "medium", riskReasonKey: "risk.rescheduled", bookedAt: daysAgo(2) },
].map((a) => ({ ...a, practiceId: "prc_1", durationMinutes: 15, feeInr: 400 })) as Appointment[];

const before = (aptId: string, hours: number) => new Date(new Date(appointments.find((a) => a.id === aptId)!.startsAt).getTime() - hours * 3600000).toISOString();
// Automatic reminders go out 24 h and 2 h before each visit. Past ones carry sentAt; future ones are queued.
export const reminders: Reminder[] = [
  { id: "rem_1", appointmentId: "apt_4", channel: "whatsapp", lang: "en", state: "confirmed", offset: "24h", scheduledFor: before("apt_4", 24), sentAt: before("apt_4", 24), updatedAt: before("apt_4", 22), isManual: false },
  { id: "rem_2", appointmentId: "apt_5", channel: "whatsapp", lang: "ta", state: "no_reply", offset: "24h", scheduledFor: before("apt_5", 24), sentAt: before("apt_5", 24), updatedAt: before("apt_5", 24), isManual: false },
  { id: "rem_3", appointmentId: "apt_2", channel: "whatsapp", lang: "en", state: "delivered", offset: "24h", scheduledFor: before("apt_2", 24), sentAt: before("apt_2", 24), updatedAt: before("apt_2", 24), isManual: false },
  { id: "rem_4", appointmentId: "apt_6", channel: "whatsapp", lang: "ta", state: "queued", offset: "2h", scheduledFor: before("apt_6", 2), updatedAt: before("apt_6", 26), isManual: false },
];

/** Settings defaults: Mon–Sat 9 am–8 pm with an afternoon break, Sunday closed. */
export const defaultSettings: ClinicSettings = {
  practiceName: `Dr. ${demoDoctor.fullName}`,
  hours: ([0, 1, 2, 3, 4, 5, 6] as const).map((weekday) => ({ weekday, opensAt: "09:00", closesAt: "20:00", closed: weekday === 0 })),
  slotMinutes: 15,
  defaultFeeInr: 400,
  defaultReminderLang: "ta",
  breaks: [{ id: "brk_1", startsAt: "13:00", endsAt: "17:00" }],
  daysOff: [],
  whatsappConnected: true,
  staffInvites: [],
};
