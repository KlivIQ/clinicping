/* ClinicPing — © 2026 KlivIQ Technologies. Built by KlivIQ Technologies. */
import type { Appointment, Patient, Reminder, WorkingHours } from './models';

export type DemoReminder = Reminder & { kind?: 'appointment' | 'delay'; previewTime?: string };
export type DemoState = { appointments: Appointment[]; patients: Patient[]; reminders: DemoReminder[]; consultationId: string | null; delayMinutes: number };
export const active = (a: Appointment) => a.status === 'booked' || a.status === 'arrived';
export function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function slotsForDay(date: string, hours: WorkingHours[], duration = 15): string[] {
  const weekday = new Date(`${date}T12:00`).getDay();
  return hours.filter(h => h.weekday === weekday).flatMap(h => {
    const minutes = (v: string) => Number(v.slice(0, 2)) * 60 + Number(v.slice(3, 5));
    const slots: string[] = [];
    for (let m = minutes(h.opensAt); m + duration <= minutes(h.closesAt); m += duration) slots.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
    return slots;
  });
}
export function hasConflict(rows: Appointment[], startsAt: string, duration: number, excludeId?: string) {
  const start = new Date(startsAt).getTime();
  return rows.some(a => a.id !== excludeId && active(a) && start < new Date(a.startsAt).getTime() + a.durationMinutes * 60000 && start + duration * 60000 > new Date(a.startsAt).getTime());
}
export function updateStatus(state: DemoState, id: string, status: Appointment['status']): DemoState {
  return { ...state, appointments: state.appointments.map(a => a.id === id ? { ...a, status } : a), consultationId: state.consultationId === id ? null : state.consultationId };
}
export function beginConsultation(state: DemoState, id: string): DemoState {
  if (state.consultationId || !state.appointments.some(a => a.id === id && a.status === 'arrived')) return state;
  return { ...state, consultationId: id };
}
export function applyDelay(state: DemoState, minutes: number, date: string): DemoState {
  const affected = state.appointments.filter(a => active(a) && a.id !== state.consultationId && localDate(new Date(a.startsAt)) === date);
  const ids = new Set(affected.map(a => a.id));
  const shifted = state.appointments.map(a => ids.has(a.id) ? { ...a, startsAt: new Date(new Date(a.startsAt).getTime() + minutes * 60000).toISOString() } : a);
  const now = new Date().toISOString();
  return { ...state, appointments: shifted, delayMinutes: state.delayMinutes + minutes, reminders: [...state.reminders, ...shifted.filter(a => ids.has(a.id)).map(a => ({ id: crypto.randomUUID(), appointmentId: a.id, channel: 'whatsapp' as const, lang: state.patients.find(p => p.id === a.patientId)?.preferredLang ?? 'en', state: 'delivered' as const, isManual: true, sentAt: now, updatedAt: now, kind: 'delay' as const, previewTime: a.startsAt }))] };
}export function reschedule(state: DemoState, id: string, startsAt: string): DemoState {
  const a = state.appointments.find(x => x.id === id);
  if (!a || hasConflict(state.appointments, startsAt, a.durationMinutes, id)) return state;
  return { ...state, appointments: state.appointments.map(x => x.id === id ? { ...x, startsAt } : x) };
}
export type NewAppointment = { patientId?: string | undefined; name: string; phone: string; lang: 'en' | 'ta'; startsAt: string; feeInr: number };
export function validateNew(state: DemoState, n: NewAppointment): 'invalid' | 'duplicate' | 'conflict' | null {
  const phone = n.phone.replace(/\D/g, '');
  if (!n.patientId && (!n.name.trim() || !/^[6-9]\d{9}$/.test(phone))) return 'invalid';
  if (!Number.isInteger(n.feeInr) || n.feeInr < 0) return 'invalid';
  if (!n.patientId && state.patients.some(p => p.phone === `+91${phone}`)) return 'duplicate';
  if (hasConflict(state.appointments, n.startsAt, 15)) return 'conflict';
  return null;
}
export function addAppointment(state: DemoState, n: NewAppointment): DemoState {
  if (validateNew(state, n)) return state;
  const now = new Date().toISOString();
  let patients = state.patients, patientId = n.patientId;
  if (!patientId) {
    patientId = `pat_${crypto.randomUUID()}`;
    patients = [...patients, { id: patientId, practiceId: 'prc_1', fullName: n.name.trim(), phone: `+91${n.phone.replace(/\D/g, '')}`, preferredLang: n.lang, visitCount: 0, noShowCount: 0, createdAt: now }];
  }
  const appt: Appointment = { id: `apt_${crypto.randomUUID()}`, practiceId: 'prc_1', patientId, startsAt: n.startsAt, durationMinutes: 15, source: 'manual', status: 'booked', riskLevel: 'low', riskReasonKey: 'risk.regular', feeInr: n.feeInr, bookedAt: now };
  return { ...state, patients, appointments: [...state.appointments, appt] };
}
export function addReminder(state: DemoState, appointmentId: string): DemoState {
  const a = state.appointments.find(x => x.id === appointmentId); if (!a) return state;
  const now = new Date().toISOString();
  const lang = state.patients.find(p => p.id === a.patientId)?.preferredLang ?? 'en';
  return { ...state, reminders: [...state.reminders, { id: crypto.randomUUID(), appointmentId, channel: 'whatsapp', lang, state: 'delivered', isManual: true, sentAt: now, updatedAt: now, kind: 'appointment', previewTime: a.startsAt }] };
}
export function setReminderState(state: DemoState, id: string, s: Reminder['state']): DemoState {
  return { ...state, reminders: state.reminders.map(r => r.id === id ? { ...r, state: s, updatedAt: new Date().toISOString() } : r) };
}
