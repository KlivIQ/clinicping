# ClinicPing update: Settings, reminder log, Tamil copy, consistency, README

Mock data only. Changes reset on reload. No new features beyond this list.

## 1. Settings screen (replaces the placeholder)
Each section saves into the shared in-memory clinic demo state, so other screens see changes until reload.
- **Clinic:** practice name (defaults to "Dr. Ravi Kumar"). Address and registration number, both labelled "(optional)".
- **Working hours:** one row per weekday (Sun–Sat) with start time, end time and a Closed toggle.
- **Slots:** slot length picker (10 / 15 / 20 / 30 min) and default fee (₹).
- **Breaks:** list of daily breaks, each with start, end and a remove button. "Add break" starts with lunch, 1:00–2:00 pm.
- **Days off:** pick a single date or a from–to range. Saved days off are listed and can be removed.
- **Language:** app language toggle, plus the default reminder language for new patients.
- **WhatsApp:** status card that says "Connected to demo number". No setup flow.
- **Staff:** a collapsed "Add staff" row at the bottom. Tapping it opens a simple mock invite form (name, mobile). Sending shows "Invite saved (demo)". No role screens.
- **Sign out** button.

**Calendar and Add follow these settings.** Free slots come from working hours and slot length, minus breaks. Closed weekdays and days off show no free slots, with a "Closed" note. The Add fee field starts at the default fee. Patients added as new get the default reminder language.

## 2. Credit
Right now Settings shows "Built by KlivIQ Technologies" twice: once from the Settings page and once from the signed-in layout. I'll take out the Settings page's own copy, so it shows once at the bottom. No other screens change.

## 3. Reminder log
- Each entry gets a label for which reminder it is ("24 hours before" or "2 hours before"), plus "Scheduled for …" or "Sent at …" with the time.
- The message preview starts with the sender, "Dr. Ravi Kumar's clinic" (Tamil: "டாக்டர் ரவி குமார் கிளினிக்"). It uses the practice name from Settings.
- Display-only reply buttons inside the preview: Confirm, Reschedule, Cancel.
- All "Simulate …" buttons move off the cards into one collapsible "Demo controls" panel on the page. You pick an entry, then simulate a reply (confirm / reschedule / cancel), a failure or a retry. The status chip on that entry updates.
- The "Demo clinic, no messages sent" notice stays.

## 4. Tamil copy
- Times in Tamil read as "காலை 9:30 மணிக்கு" or "மாலை 5:30 மணிக்கு": a period-of-day word, the 12-hour time with no am/pm, then மணிக்கு. Periods: அதிகாலை, காலை, மதியம், மாலை, இரவு.
- Every Tamil string moves into one file (`src/lib/copy-ta.ts`). Each line has a `// NEEDS NATIVE REVIEW` comment, and the file has a banner at the top.

## 5. Consistency
- Today, Calendar and Reminders all read appointment, status and risk-reason data from the same shared state, through shared helpers for status label, risk label and reason text. No screen keeps its own copy.
- A check pass in Tamil mode on Settings, the reminder log and Demo controls, so no English is left except names and numbers.

## 6. README
New sections: Screens (one line each), Mock data shape (Practice, WorkingHours, breaks, days off, Patient, Appointment, Reminder), What is mocked, and Pending backend work: database, real phone OTP, WhatsApp through an external messaging service.

## Technical details
- `models.ts` / `schema.sql`: add `ClinicSettings` (slotMinutes, defaultFeeInr, defaultReminderLang, breaks, daysOff, address?, registrationNo?), reusing the existing `WorkingHours`, `TimeBlock` and `StaffInvite` types where they fit.
- `clinic-demo.ts`: `DemoState` gets `settings`. Pure functions `freeSlots(date, settings, appointments)` and `isClosed(date, settings)` replace the current `slotsForDay` calls. `Reminder` gets `offset: '24h' | '2h'` and `sentAt`. `setReminderState` handles the reply outcomes. New tests: breaks removed, closed days empty, slot length respected, day-off range.
- `formatTimeTa(hhmm)` helper with tests: 9:30 gives காலை, 17:30 gives மாலை, and so on.
- `i18n.tsx` and `phase2-copy.ts` become English-only. Tamil is imported from `copy-ta.ts`, typed `Record<Key, string>` so a missing key fails the typecheck.
- Run vitest and a Playwright pass at 360px in English and Tamil on Settings, Calendar, Add and Reminders.
