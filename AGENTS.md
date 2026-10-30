<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# ClinicPing — Built by KlivIQ Technologies

- Domain types live in `src/lib/models.ts` and mirror `supabase/schema.sql`; UI reads only from `src/lib/mock-data.ts` so a backend can swap in without UI changes.
- Auth is a UI-only mock in `src/lib/session.ts` (localStorage) until the real phone-OTP backend is connected.
- All UI copy goes through `src/lib/i18n.tsx` (English + Tamil); never hardcode user-facing strings.
- Signed-in screens live under the `_clinic` pathless layout, which owns the bottom tabs and the session guard.
- Every source file starts with the KlivIQ Technologies copyright/credit header.
