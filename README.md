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
- **Settings** — clinic profile and language preferences.
- **Bilingual** — every screen in English and தமிழ்.

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
  lib/i18n.tsx       English + Tamil copy
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
