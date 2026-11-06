# ClinicPing
<sub><b>BY KLIVIQ</b></sub>

**Fewer empty chairs. Calmer days.** ClinicPing is a mobile-first web app that helps Indian doctors and small clinics run a calm daily queue, keep patients informed about delays, and reduce no-shows with timely reminders — in English and Tamil.

Built by **KlivIQ Technologies**.

---

## Features

- **Landing page** with an interactive "Doctor running 15 min late" simulation showing how the queue and patient message update.
- **Demo sign-in & onboarding** — phone number + OTP flow (demo: `9840012345` / OTP `123456`).
- **Today** — live queue: arrive, start consultation (one at a time), complete, no-show, cancel, and a cascading 15-minute delay.
- **Calendar** — weekly view of booked and free slots with rescheduling.
- **Quick Add** — new appointments with validation and conflict prevention.
- **Reminders** — simulated reminder log with English/Tamil previews, retry and confirmation (no real messages are sent).
- **Settings** — clinic details, hours, slots, breaks, days off, languages, WhatsApp status and staff invite.
- **Bilingual** — every screen in English and தமிழ்.

## Screens

| Screen | What it does |
| --- | --- |
| Landing (`/`) | What ClinicPing does, with an interactive "Doctor running 15 min late" preview |
| Sign in (`/login`) | Phone number → OTP → name → clinic ready |
| Today (`/today`) | Live queue: arrive, consult (one at a time), done, no-show, cancel, 15-min delay |
| Calendar (`/calendar`) | Week strip plus one day timeline; free gaps open Add with that time |
| Add (`/add`) | One name-or-mobile box, Today/Tomorrow, next free slot, save |
| Reminders (`/reminders`) | 24 h / 2 h reminder log, sender, reply buttons, simulated replies under Demo controls |
| Settings (`/settings`) | Clinic details, hours, slot length, fee, breaks, days off, languages, WhatsApp status, staff invite, sign out |

## Mock data shape

All types live in `src/lib/models.ts` and mirror `supabase/schema.sql`.

```ts
ClinicSettings { practiceName, address?, registrationNo?, hours: DayHours[], slotMinutes: 10|15|20|30,
                 defaultFeeInr, defaultReminderLang: "en"|"ta", breaks: DailyBreak[], daysOff: DayOff[],
                 whatsappConnected, staffInvites: StaffInvite[] }
DayHours     { weekday: 0-6, opensAt: "09:00", closesAt: "20:00", closed }
DailyBreak   { id, startsAt: "13:00", endsAt: "14:00" }
DayOff       { id, from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
Patient      { id, fullName, phone, preferredLang, visitCount, noShowCount }
Appointment  { id, patientId, startsAt, durationMinutes, status, riskLevel, riskReasonKey, feeInr, source }
Reminder     { id, appointmentId, lang, state, offset?: "24h"|"2h", scheduledFor?, sentAt?, updatedAt }
```

Free slots = working hours stepped by slot length, minus breaks, minus active bookings; closed weekdays and days off have none (`src/lib/clinic-demo.ts`, tested).

## What is mocked

- **Sign-in:** any 10-digit number works; the OTP is always `123456`. Session is kept in the browser.
- **Data:** a fictional Chennai clinic held in memory. Edits on any screen are shared across screens and reset on reload.
- **Reminders and WhatsApp:** nothing is sent. The log, delivery states and patient replies are simulated.
- **Staff invites:** saved in the demo session only; no invite is delivered.

## Tamil copy

All Tamil strings are in `src/lib/copy-ta.ts`, each marked `NEEDS NATIVE REVIEW`. Times read as "மாலை 5:30 மணிக்கு".

## Pending backend work

- **Database:** persist settings, patients, appointments and reminders (schema in `supabase/schema.sql`).
- **Real phone OTP:** replace the mock code with SMS verification.
- **WhatsApp:** send 24 h / 2 h reminders and delay updates through an external messaging service, and receive Confirm / Reschedule / Cancel replies.

## Brand system

| Token | Value | Use |
| --- | --- | --- |
| Inkberry | `#2A1E4A` | Primary, text, key surfaces |
| Peach | `#FFB59A` | Accent fills (Inkberry text on top) |
| Canvas Warm | `#FAF8F5` | Background |

- Type: Fraunces (headings), Figtree (body), Noto Serif / Noto Sans Tamil.
- Risk states (High / Medium / Low) are colour-blind-safe and always paired with an icon and label.
- Logo: *Paired Rhythm* — two slot pills, a peach node arriving in the right slot.
- 48px minimum tap targets, bottom tab navigation.

## Tech stack

- TanStack Start v1 (React 19, file-based routing, SSR)
- Vite 7, TypeScript
- Tailwind CSS v4 + shadcn/ui
- Vitest + Testing Library

## Project structure

```
src/
  components/        UI and brand components
  lib/models.ts      Domain types (mirror supabase/schema.sql)
  lib/mock-data.ts   Data access layer used by the UI
  lib/clinic-demo.ts Pure queue & scheduling rules (tested)
  lib/i18n.tsx       English copy + translator
  lib/copy-ta.ts     All Tamil copy (needs native review)
  routes/            Pages (signed-in screens under _clinic/)
supabase/schema.sql  Database schema ready for a real backend
```

The UI reads only from `mock-data.ts`, so a real backend can replace the in-memory demo without UI changes. Demo changes reset on reload.

## Getting started

Requires Node.js 20+ (or Bun).

```sh
git clone <this-repository-url>
cd clinicping
npm install
npm run dev
```

Other scripts:

```sh
npm run build   # production build
npm test        # run tests
npm run lint    # lint
```

## Roadmap

- Real phone OTP authentication
- Persistent database
- Live WhatsApp / SMS reminders and delay notifications

## License

© 2026 KlivIQ Technologies. All rights reserved.
