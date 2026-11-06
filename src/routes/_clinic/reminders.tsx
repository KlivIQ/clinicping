/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Simulated reminder log with language previews. No messages are ever sent.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScreenHeader } from "@/components/Placeholder";
import { LangToggle } from "@/components/LangToggle";
import { RiskChip, StatusChip } from "@/components/Chips";
import { translate, useI18n, type I18nKey } from "@/lib/i18n";
import { useClinicDemo } from "@/lib/mock-data";
import { setReminderState, type DemoReminder } from "@/lib/clinic-demo";
import { formatTime } from "@/lib/time-format";
import type { Lang, ReminderState } from "@/lib/models";
import { cn } from "@/lib/utils";

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
const dateOf = (iso: string, lang: Lang) => new Date(iso).toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", { day: "numeric", month: "short" });

function Reminders() {
  const { t, lang } = useI18n();
  const { state, setState } = useClinicDemo();
  const rows = [...state.reminders].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const [pickedId, setPickedId] = useState<string>("");
  const picked = rows.find((r) => r.id === pickedId) ?? rows[0];
  const sim = (s: ReminderState) => picked && setState((st) => setReminderState(st, picked.id, s));
  const nameOf = (r: DemoReminder) => state.patients.find((p) => p.id === state.appointments.find((a) => a.id === r.appointmentId)?.patientId)?.fullName ?? "";

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
            const visit = r.previewTime ?? appt?.startsAt ?? r.updatedAt;
            const pl = r.lang;
            const vars = { name: patient?.fullName ?? "", time: formatTime(visit, pl), date: dateOf(visit, pl) };
            const which = r.kind === "delay" ? t("reminders.delayLabel") : r.offset ? t(`reminders.offset${r.offset}` as I18nKey) : t("reminders.appointmentLabel");
            const stamp = r.sentAt
              ? t("reminders.sentAt", { date: dateOf(r.sentAt, lang), time: formatTime(r.sentAt, lang) })
              : r.scheduledFor ? t("reminders.scheduledFor", { date: dateOf(r.scheduledFor, lang), time: formatTime(r.scheduledFor, lang) }) : "";
            return (
              <li key={r.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{patient?.fullName}</p>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{t(`reminders.${r.state}` as I18nKey)}</span>
                </div>
                <p className="mt-1 text-sm font-medium">{which}</p>
                {stamp && <p className="text-xs text-muted-foreground">{stamp} · {t(`lang.${pl}`)}</p>}
                {appt && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">{t("reminders.visit")}: {dateOf(appt.startsAt, lang)}, {formatTime(appt.startsAt, lang)} · {t(appt.riskReasonKey as I18nKey)}</p>
                    <div className="flex flex-wrap gap-1"><StatusChip appt={appt} consultationId={state.consultationId} /><RiskChip level={appt.riskLevel} /></div>
                  </div>
                )}
                <p className="mt-3 text-xs font-medium text-muted-foreground">{t("reminders.preview")}</p>
                <div lang={pl} className="mt-1 overflow-hidden rounded-xl bg-peach/30">
                  <p className="px-3 pt-3 text-xs font-semibold">{translate(pl, "reminders.sender", { name: state.settings.practiceName })}</p>
                  <p className="px-3 pb-3 pt-1 text-sm">{translate(pl, r.kind === "delay" ? "reminders.delay" : "reminders.appointment", vars)}</p>
                  {r.kind !== "delay" && (
                    <div aria-label={t("reminders.replyHint")} className="grid grid-cols-3 border-t border-border/60 text-center text-sm font-medium">
                      {(["replyConfirm", "replyReschedule", "replyCancel"] as const).map((k, i) => (
                        <span key={k} aria-hidden className={cn("py-2", i > 0 && "border-l border-border/60")}>{translate(pl, `reminders.${k}`)}</span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {rows.length > 0 && (
          <details className="rounded-2xl border border-dashed border-border bg-card p-3">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-medium">
              {t("demo.controls")} <ChevronDown className="h-4 w-4" />
            </summary>
            <div className="space-y-3">
              <label className="block space-y-1 text-sm">
                <span className="font-medium">{t("reminders.pick")}</span>
                <select value={picked?.id} onChange={(e) => setPickedId(e.target.value)} className="min-h-12 w-full rounded-xl border border-border bg-card px-3">
                  {rows.map((r) => <option key={r.id} value={r.id}>{nameOf(r)} · {r.kind === "delay" ? t("reminders.delayLabel") : r.offset ? t(`reminders.offset${r.offset}` as I18nKey) : t("reminders.appointmentLabel")}</option>)}
                </select>
              </label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => sim("confirmed")} className={btn}>{t("reminders.simConfirm")}</button>
                <button onClick={() => sim("reschedule_requested")} className={btn}>{t("reminders.simReschedule")}</button>
                <button onClick={() => sim("cancel_requested")} className={btn}>{t("reminders.simCancel")}</button>
                <button onClick={() => sim("failed")} className={btn}>{t("reminders.fail")}</button>
                <button onClick={() => sim("delivered")} className={btn}>{t("reminders.retry")}</button>
              </div>
            </div>
          </details>
        )}
      </div>
    </>
  );
}
