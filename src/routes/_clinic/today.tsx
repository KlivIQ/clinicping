/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Today queue: arrival, consultation, completion, no-show, cancellation and doctor delay (demo only).
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Circle, Clock, Minus, Phone } from "lucide-react";
import { ScreenHeader } from "@/components/Placeholder";
import { LangToggle } from "@/components/LangToggle";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { useClinicDemo } from "@/lib/mock-data";
import { addReminder, applyDelay, beginConsultation, localDate, updateStatus } from "@/lib/clinic-demo";
import type { RiskLevel } from "@/lib/models";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_clinic/today")({
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

const riskStyle: Record<RiskLevel, { cls: string; Icon: typeof Circle }> = {
  high: { cls: "bg-risk-high-bg text-risk-high", Icon: AlertTriangle },
  medium: { cls: "bg-risk-medium-bg text-risk-medium", Icon: Minus },
  low: { cls: "bg-risk-low-bg text-risk-low", Icon: Circle },
};
export const timeOf = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
const btn = "min-h-12 rounded-full px-4 text-sm font-medium";

function Today() {
  const { t } = useI18n();
  const { state, setState } = useClinicDemo();
  const [confirmDelay, setConfirmDelay] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);
  const today = localDate(new Date());
  const rows = state.appointments
    .filter((a) => localDate(new Date(a.startsAt)) === today)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((a) => ({ ...a, patient: state.patients.find((p) => p.id === a.patientId)! }));
  const callFirst = rows.filter((r) => r.riskLevel === "high" && r.status === "booked");
  const statusLabel = (r: (typeof rows)[number]) =>
    state.consultationId === r.id ? t("queue.consultation") : r.status === "done" ? t("queue.completed") : r.status === "booked" ? t("queue.upcoming") : t(`status.${r.status}` as I18nKey);

  return (
    <>
      <ScreenHeader title={t("nav.today")} right={<LangToggle />} />
      <div className="space-y-6 px-5">
        <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">{t("demo.notice")}</p>

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
                    <p className="font-semibold">{r.patient.fullName} · {timeOf(r.startsAt)}</p>
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
              const { cls, Icon } = riskStyle[r.riskLevel];
              const inConsult = state.consultationId === r.id;
              const closed = r.status === "done" || r.status === "no_show" || r.status === "cancelled";
              return (
                <li key={r.id} className={cn("rounded-2xl border bg-card p-3", inConsult ? "border-primary" : "border-border")}>
                  <div className="flex items-start gap-3">
                    <span className="w-16 pt-0.5 text-sm font-semibold tabular-nums">{timeOf(r.startsAt)}</span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("font-semibold", closed && "text-muted-foreground line-through")}>{r.patient.fullName}</p>
                      <p className="text-sm text-muted-foreground">{statusLabel(r)} · {t(`src.${r.source}`)}</p>
                    </div>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium", cls)}>
                      <Icon className="h-3 w-3" /> {t(`risk.${r.riskLevel}`)}
                    </span>
                  </div>
                  {!closed && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.status === "booked" && <button onClick={() => setState((s) => updateStatus(s, r.id, "arrived"))} className={cn(btn, "bg-primary text-primary-foreground")}>{t("queue.arrive")}</button>}
                      {r.status === "arrived" && !inConsult && <button disabled={!!state.consultationId} onClick={() => setState((s) => beginConsultation(s, r.id))} className={cn(btn, "bg-primary text-primary-foreground disabled:opacity-40")}>{t("queue.start")}</button>}
                      {inConsult && <button onClick={() => setState((s) => updateStatus(s, r.id, "done"))} className={cn(btn, "bg-peach text-accent-foreground")}>{t("queue.finish")}</button>}
                      {r.status === "booked" && <button onClick={() => setState((s) => updateStatus(s, r.id, "no_show"))} className={cn(btn, "border border-border")}>{t("queue.noShow")}</button>}
                      {r.status === "booked" && <button onClick={() => { setState((s) => addReminder(s, r.id)); setSent(r.id); }} className={cn(btn, "border border-border")}>{t("queue.remind")}</button>}
                      {!inConsult && (cancelId === r.id
                        ? <button onClick={() => { setState((s) => updateStatus(s, r.id, "cancelled")); setCancelId(null); }} className={cn(btn, "border border-risk-high text-risk-high")}>{t("queue.confirmCancel")}</button>
                        : <button onClick={() => setCancelId(r.id)} className={cn(btn, "border border-border")}>{t("queue.cancel")}</button>)}
                    </div>
                  )}
                  {sent === r.id && <p className="mt-2 text-xs text-muted-foreground">{t("queue.sent")}</p>}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </>
  );
}
