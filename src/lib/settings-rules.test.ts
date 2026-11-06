/* ClinicPing — © 2026 KlivIQ Technologies. Built by KlivIQ Technologies. */
import { describe, expect, it } from 'vitest';
import { daySlots, freeSlots, isClosed, localDate, validateNew } from './clinic-demo';
import { createClinicDemoState } from './mock-data';
import { formatClock } from './time-format';
const nextWeekday = (wd: number) => { const d = new Date(); d.setDate(d.getDate() + 7 + ((wd - d.getDay() + 7) % 7)); return localDate(d); };
describe('settings drive slots', () => {
  const s = createClinicDemoState().settings;
  const mon = nextWeekday(1);
  it('skips breaks', () => {
    const slots = daySlots(mon, s);
    expect(slots).toContain('12:45');
    expect(slots).not.toContain('13:00');
    expect(slots).not.toContain('16:45');
    expect(slots).toContain('17:00');
  });
  it('respects slot length', () => {
    expect(daySlots(mon, { ...s, slotMinutes: 30 }).slice(0, 3)).toEqual(['09:00', '09:30', '10:00']);
    expect(daySlots(mon, { ...s, slotMinutes: 20, breaks: [] }).at(-1)).toBe('19:40');
  });
  it('closed weekday and day-off range give no free slots', () => {
    expect(freeSlots(nextWeekday(0), s, [])).toEqual([]);
    const tue = nextWeekday(2), wed = nextWeekday(3);
    const off = { ...s, daysOff: [{ id: 'x', from: mon, to: tue }] };
    expect(isClosed(mon, off)).toBe(true);
    expect(freeSlots(tue, off, [])).toEqual([]);
    expect(freeSlots(wed, off, []).length).toBeGreaterThan(0);
  });
  it('conflict check uses slot length', () => {
    const st = createClinicDemoState();
    st.settings.slotMinutes = 30;
    const at = new Date(); at.setHours(9, 15, 0, 0);
    expect(validateNew(st, { name: 'Asha', phone: '9876543210', lang: 'ta', startsAt: at.toISOString(), feeInr: 400 })).toBe('conflict');
  });
});
describe('Tamil time', () => {
  it('uses period-of-day words', () => {
    expect(formatClock('09:30', 'ta')).toBe('காலை 9:30');
    expect(formatClock('17:30', 'ta')).toBe('மாலை 5:30');
    expect(formatClock('13:00', 'ta')).toBe('மதியம் 1:00');
    expect(formatClock('20:15', 'ta')).toBe('இரவு 8:15');
    expect(formatClock('17:30', 'en')).toBe('5:30 pm');
  });
});
