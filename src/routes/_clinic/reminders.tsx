/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Simulated reminder log with language previews. No messages are ever sent.
 */
import { createFileRoute } from "@tanstack/react-router";
import { ScreenHeader } from "@/components/Placeholder";
import { LangToggle } from "@/components/LangToggle";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { useClinicDemo } from "@/lib/mock-data";
import { setReminderState } from "@/lib/clinic-demo";

export const Route = createFileRoute("/_clinic/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — ClinicPing" },
      { name: "description", content: "Reminder log for each appointment." },
      { property: "og:title", content: "Reminders — ClinicPing" },
      { property: "og:description", content: "Reminder log for each appointment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Reminders,
});

const btn = "min-h-12 rounded-full border border-border px-4 text-sm font-medium";

function Reminders() {
  const { t } = useI18n();
  const { state, setState } = useClinicDemo();
  const rows = [...state.reminders].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <>
      <ScreenHeader title={t("reminders.title")} right={<LangToggle />} />
      <div className="space-y-4 px-5">
        <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">{t("demo.notice")}</p>
        {rows.length === 0 && <p className="text-sm text-muted-foreground">{t("reminders.empty")}</p>}
        <ul className="space-y-3">
          {rows.map((r) => {
            const appt = state.appointments.find((a) => a.id === r.appointmentId);
            const patient = state.patients.find((p) => p.id === appt?.patientId);
            const when = new Date(r.previewTime ?? appt?.startsAt ?? r.updatedAt);
            const vars = { name: patient?.fullName ?? "", time: when.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }), date: when.toLocaleDateString(r.lang === "ta" ? "ta-IN" : "en-IN", { day: "numeric", month: "short" }) };
            const tpl = r.kind === "delay" ? "reminders.delay" : "reminders.appointment";
            return (
              <li key={r.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{patient?.fullName}</p>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{t(`reminders.${r.state}` as I18nKey)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{t(r.kind === "delay" ? "reminders.delayLabel" : "reminders.appointmentLabel")} · {t(`lang.${r.lang}`)}</p>
                <p className="mt-2 text-xs font-medium text-muted-foreground">{t("reminders.preview")}</p>
                <p lang={r.lang} className="mt-1 rounded-xl bg-peach/30 p-3 text-sm">{previewText(tpl, r.lang, vars, t)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.state !== "confirmed" && <button onClick={() => setState((s) => setReminderState(s, r.id, "confirmed"))} className={btn}>{t("reminders.confirm")}</button>}
                  {r.state !== "failed" && r.state !== "confirmed" && <button onClick={() => setState((s) => setReminderState(s, r.id, "failed"))} className={btn}>{t("reminders.fail")}</button>}
                  {(r.state === "failed" || r.state === "no_reply") && <button onClick={() => setState((s) => setReminderState(s, r.id, "delivered"))} className={btn}>{t("reminders.retry")}</button>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

import { phase2En, phase2Ta } from "@/lib/phase2-copy";
// Preview always uses the patient's language, independent of the doctor's UI language.
function previewText(k: "reminders.delay" | "reminders.appointment", lang: string, vars: Record<string, string>, _t: unknown) {
  let s = (lang === "ta" ? phase2Ta : phase2En)[k];
  for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
  return s;
}
