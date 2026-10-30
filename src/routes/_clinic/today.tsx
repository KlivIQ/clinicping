/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Placeholder Today screen — read-only preview of mock appointments.
 */
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Circle, Minus, Phone } from "lucide-react";
import { ScreenHeader } from "@/components/Placeholder";
import { LangToggle } from "@/components/LangToggle";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { appointments, patients } from "@/lib/mock-data";
import type { RiskLevel } from "@/lib/models";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_clinic/today")({
  head: () => ({
    meta: [
      { title: "Today — ClinicPing" },
      { name: "description", content: "Today's appointments in time order." },
      { property: "og:title", content: "Today — ClinicPing" },
      { property: "og:description", content: "Today's appointments in time order." },
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

function Today() {
  const { t } = useI18n();
  const rows = appointments.map((a) => ({ ...a, patient: patients.find((p) => p.id === a.patientId)! }));
  const callFirst = rows.filter((r) => r.riskLevel === "high" && r.status === "booked");
  const time = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

  return (
    <>
      <ScreenHeader title={t("nav.today")} right={<LangToggle />} />
      <div className="space-y-6 px-5">
        <section>
          <h2 className="mb-2 text-lg font-semibold">{t("today.callFirst")}</h2>
          <ul className="space-y-2">
            {callFirst.map((r) => (
              <li key={r.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <div className="flex-1">
                  <p className="font-semibold">{r.patient.fullName} · {time(r.startsAt)}</p>
                  <p className="text-sm text-risk-high">{t(r.riskReasonKey as I18nKey)}</p>
                </div>
                <a href={`tel:${r.patient.phone}`} className="flex min-h-12 items-center gap-2 rounded-full bg-peach px-4 font-medium text-accent-foreground">
                  <Phone className="h-4 w-4" /> {t("call")}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">{t("today.all")}</h2>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {rows.map((r) => {
              const { cls, Icon } = riskStyle[r.riskLevel];
              return (
                <li key={r.id} className="flex min-h-16 items-start gap-3 p-3">
                  <span className="w-16 pt-0.5 text-sm font-semibold tabular-nums">{time(r.startsAt)}</span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("font-semibold", r.status === "done" && "text-muted-foreground line-through")}>{r.patient.fullName}</p>
                    <p className="text-sm text-muted-foreground">{t(`src.${r.source}`)} · {t(r.riskReasonKey as I18nKey)}</p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium", cls)}>
                    <Icon className="h-3 w-3" /> {t(`risk.${r.riskLevel}`)}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-center text-sm text-muted-foreground">{t("soon")}</p>
        </section>
      </div>
    </>
  );
}
