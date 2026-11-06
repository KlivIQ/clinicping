/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Today queue: arrival, consultation, completion, no-show, cancellation and doctor delay (demo only).
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown, Clock, MoreHorizontal, Phone } from "lucide-react";
import { ScreenHeader } from "@/components/Placeholder";
import { SignOutButton } from "@/components/SignOutButton";
import { RiskChip, StatusChip } from "@/components/Chips";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { useClinicDemo } from "@/lib/mock-data";
import { addReminder, applyDelay, beginConsultation, localDate, updateStatus } from "@/lib/clinic-demo";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/time-format";
import type { Lang } from "@/lib/models";

export const Route = createFileRoute("/_clinic/today")({
  validateSearch: (s: Record<string, unknown>): { added?: string } => (typeof s['added'] === "string" ? { added: s['added'] } : {}),
  head: () => ({
    meta: [
      { title: "Today — ClinicPing" },
      { name: "description", content: "Today's patient queue in time order." },
      { property: "og:title", content: "Today — ClinicPing" },
      { property: "og:description", content: "Today's patient queue in time order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Today,
});

export const timeOf = (iso: string, lang: Lang = "en") => formatTime(iso, lang);
const btn = "min-h-12 rounded-full px-4 text-sm font-medium";

function Today() {
  const { t, lang } = useI18n();
  const { added } = Route.useSearch();
  const { state, setState } = useClinicDemo();
  const [confirmDelay, setConfirmDelay] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const now = new Date();
  const today = localDate(now);
  const rows = state.appointments
    .filter((a) => localDate(new Date(a.startsAt)) === today)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((a) => ({ ...a, patient: state.patients.find((p) => p.id === a.patientId)! }));
  const callFirst = rows.filter((r) => r.riskLevel === "high" && r.status === "booked");
  const callFirstIds = new Set(callFirst.map((r) => r.id));
  const upcoming = rows.filter((r) => r.status === "booked");
  const addedRow = rows.find((r) => r.id === added);
  const dateLabel = now.toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", { weekday: "short", day: "numeric", month: "short" });

  return (
    <>
      <ScreenHeader title={t("nav.today")} right={<SignOutButton />} />
      <div className="space-y-6 px-5">
        <p className="text-base font-semibold">{t("today.header", { date: dateLabel, count: String(rows.length) })}</p>
        {addedRow && (
          <p role="status" className="flex items-center gap-2 rounded-xl border border-primary bg-card px-3 py-2 text-sm font-medium">
            <Check className="h-4 w-4" /> {t("add.booked", { name: addedRow.patient.fullName, time: timeOf(addedRow.startsAt, lang) })}
          </p>
        )}

        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-semibold"><Clock className="h-4 w-4" /> {t("queue.delay")}</h2>
              {state.delayMinutes > 0 && <p className="text-sm text-muted-foreground">{t("queue.delayTotal", { minutes: String(state.delayMinutes) })}</p>}
            </div>
            {!confirmDelay && <button onClick={() => setConfirmDelay(true)} className={cn(btn, "bg-peach text-accent-foreground")}>{t("queue.applyDelay")}</button>}
          </div>
          {confirmDelay && (
            <div className="mt-3 space-y-2">
              <p className="font-medium">{t("queue.delayConfirm")}</p>
              <p className="text-sm text-muted-foreground">{t("queue.delaySub")}</p>
              <div className="flex gap-2">
                <button onClick={() => { setState((s) => applyDelay(s, 15, today)); setConfirmDelay(false); }} className={cn(btn, "bg-primary text-primary-foreground")}>{t("queue.applyDelay")}</button>
                <button onClick={() => setConfirmDelay(false)} className={cn(btn, "border border-border")}>{t("common.close")}</button>
              </div>
            </div>
          )}
        </section>

        {callFirst.length > 0 && (
          <section>
            <h2 className="mb-2 text-lg font-semibold">{t("today.callFirst")}</h2>
            <ul className="space-y-2">
              {callFirst.map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                  <div className="flex-1">
                    <p className="font-semibold">{r.patient.fullName} · {timeOf(r.startsAt, lang)}</p>
                    <p className="text-sm text-risk-high">{t(r.riskReasonKey as I18nKey)}</p>
                  </div>
                  <a href={`tel:${r.patient.phone}`} className="flex min-h-12 items-center gap-2 rounded-full bg-peach px-4 font-medium text-accent-foreground">
                    <Phone className="h-4 w-4" /> {t("call")}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="mb-2 text-lg font-semibold">{t("today.all")}</h2>
          {rows.length === 0 && <p className="text-sm text-muted-foreground">{t("queue.empty")}</p>}
          <ul className="space-y-2">
            {rows.map((r) => {
              const inConsult = state.consultationId === r.id;
              const closed = r.status === "done" || r.status === "no_show" || r.status === "cancelled";
              return (
                <li key={r.id} className={cn("rounded-2xl border bg-card p-3", inConsult ? "border-primary" : "border-border", r.id === added && "ring-2 ring-peach")}>
                  <div className="flex items-start gap-3">
                    <span className={cn("w-20 shrink-0 pt-0.5 text-sm font-semibold tabular-nums", closed && "text-muted-foreground")}>{timeOf(r.startsAt, lang)}</span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("font-semibold", closed && "font-medium text-muted-foreground")}>{r.patient.fullName}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        <StatusChip appt={r} consultationId={state.consultationId} />
                        {callFirstIds.has(r.id) && <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium"><Phone className="mr-1 inline h-3 w-3" />{t("today.tag")}</span>}
                      </div>
                    </div>
                    {!closed && <RiskChip level={r.riskLevel} />}
                    {r.status === "booked" && (
                      <button aria-label={t("queue.more")} aria-expanded={menuId === r.id} onClick={() => { setMenuId(menuId === r.id ? null : r.id); setCancelId(null); }}
                        className="-my-1 -mr-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full hover:bg-muted">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  {r.status === "booked" && menuId === r.id && (
                    <div className="mt-2 flex flex-wrap gap-2 border-t border-border pt-2">
                      <button onClick={() => { setState((s) => updateStatus(s, r.id, "no_show")); setMenuId(null); }} className={cn(btn, "border border-border")}>{t("queue.noShow")}</button>
                      {cancelId === r.id
                        ? <button onClick={() => { setState((s) => updateStatus(s, r.id, "cancelled")); setCancelId(null); setMenuId(null); }} className={cn(btn, "border border-risk-high text-risk-high")}>{t("queue.confirmCancel")}</button>
                        : <button onClick={() => setCancelId(r.id)} className={cn(btn, "border border-border")}>{t("queue.cancel")}</button>}
                    </div>
                  )}
                  {!closed && (
                    <div className="mt-3">
                      {r.status === "booked" && <button onClick={() => setState((s) => updateStatus(s, r.id, "arrived"))} className={cn(btn, "w-full bg-primary text-primary-foreground")}>{t("queue.arrive")}</button>}
                      {r.status === "arrived" && !inConsult && <button disabled={!!state.consultationId} onClick={() => setState((s) => beginConsultation(s, r.id))} className={cn(btn, "w-full bg-primary text-primary-foreground disabled:opacity-40")}>{t("queue.startShort")}</button>}
                      {inConsult && <button onClick={() => setState((s) => updateStatus(s, r.id, "done"))} className={cn(btn, "w-full bg-peach text-accent-foreground")}>{t("queue.done")}</button>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <details className="rounded-2xl border border-dashed border-border bg-card p-3">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-medium">
            {t("demo.controls")} <ChevronDown className="h-4 w-4" />
          </summary>
          <p className="mb-2 text-xs text-muted-foreground">{t("demo.notice")}</p>
          {upcoming.length === 0 ? <p className="text-sm text-muted-foreground">{t("queue.empty")}</p> : (
            <ul className="space-y-2">
              {upcoming.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm">{timeOf(r.startsAt, lang)} · {r.patient.fullName}</span>
                  <button onClick={() => { setState((s) => addReminder(s, r.id)); setSent(r.id); }} className={cn(btn, "border border-border")}>
                    {sent === r.id ? t("queue.sent") : t("queue.remind")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </details>
      </div>
    </>
  );
}
