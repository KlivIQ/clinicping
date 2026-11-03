/* ClinicPing — © 2026 KlivIQ Technologies. Built by KlivIQ Technologies. */
import { describe, expect, it } from 'vitest';
import { addAppointment, applyDelay, beginConsultation, hasConflict, localDate, reschedule, updateStatus, validateNew } from './clinic-demo';
import { createClinicDemoState } from './mock-data';
const at = (h: number, m = 0) => { const d = new Date(); d.setHours(h, m, 0, 0); return d.toISOString(); };
describe('clinic demo rules', () => {
  it('detects overlapping 15-minute slots', () => {
    const s = createClinicDemoState();
    expect(hasConflict(s.appointments, at(9, 30), 15)).toBe(true);
    expect(hasConflict(s.appointments, at(9, 45), 15)).toBe(false);
  });
  it('allows only one consultation at a time', () => {
    let s = updateStatus(createClinicDemoState(), 'apt_2', 'arrived');
    s = updateStatus(s, 'apt_3', 'arrived');
    s = beginConsultation(s, 'apt_2');
    expect(beginConsultation(s, 'apt_3').consultationId).toBe('apt_2');
  });
  it('delay shifts remaining appointments by 15 minutes but not done or in-consultation', () => {
    let s = updateStatus(createClinicDemoState(), 'apt_2', 'arrived');
    s = beginConsultation(s, 'apt_2');
    const d = applyDelay(s, 15, localDate(new Date()));
    expect(d.appointments.find(a => a.id === 'apt_1')!.startsAt).toBe(at(9));
    expect(d.appointments.find(a => a.id === 'apt_2')!.startsAt).toBe(at(9, 30));
    expect(d.appointments.find(a => a.id === 'apt_3')!.startsAt).toBe(at(10, 30));
    expect(d.delayMinutes).toBe(15);
  });
  it('cancelled appointments free their slot', () => {
    const s = updateStatus(createClinicDemoState(), 'apt_2', 'cancelled');
    expect(hasConflict(s.appointments, at(9, 30), 15)).toBe(false);
  });
  it('rescheduling into a booked slot is refused', () => {
    const s = createClinicDemoState();
    expect(reschedule(s, 'apt_2', at(10, 15))).toBe(s);
    expect(reschedule(s, 'apt_2', at(12)).appointments.find(a => a.id === 'apt_2')!.startsAt).toBe(at(12));
  });
  it('quick add validates phone, duplicates, fee and conflicts', () => {
    const s = createClinicDemoState();
    const base = { name: 'Asha', phone: '9876543210', lang: 'ta' as const, startsAt: at(12), feeInr: 400 };
    expect(validateNew(s, { ...base, phone: '12345' })).toBe('invalid');
    expect(validateNew(s, { ...base, feeInr: -1 })).toBe('invalid');
    expect(validateNew(s, { ...base, phone: '9841100001' })).toBe('duplicate');
    expect(validateNew(s, { ...base, startsAt: at(9, 30) })).toBe('conflict');
    expect(addAppointment(s, base).appointments).toHaveLength(7);
  });
});
