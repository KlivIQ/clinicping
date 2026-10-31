/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import { useState } from "react";
import { ArrowRight, Check, CheckCheck, Clock3, MessageSquareText, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/Logo";
import { useI18n } from "@/lib/i18n";
import { previewTime } from "@/lib/landing-demo";
import { cn } from "@/lib/utils";

export function LandingPreview() {
  const { t } = useI18n();
  const [delayed, setDelayed] = useState(false);
  const patients = [
    { name: t("landing.patient1"), time: "9:30", status: t("landing.waiting"), icon: Clock3 },
    { name: t("landing.patient2"), time: "9:45", status: t("landing.confirmed"), icon: Check },
    { name: t("landing.patient3"), time: "10:00", status: t("landing.next"), icon: ArrowRight },
  ];

  return (
    <section className="landing-demo mx-auto max-w-5xl px-5 py-9 sm:px-8 sm:py-12" aria-labelledby="preview-title">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">{t("landing.previewLabel")}</p>
          <h2 id="preview-title" className="mt-2 text-2xl font-semibold">{t("landing.preview")}</h2>
        </div>
        <Button variant="outline" role="switch" aria-checked={delayed} onClick={() => setDelayed(!delayed)} className="h-auto min-h-12 max-w-full gap-3 rounded-full border-border bg-card px-4 py-3 text-left whitespace-normal shadow-none">
          <Clock3 aria-hidden="true" />
          <span className="flex-1">{t("landing.delay")}</span>
          <span aria-hidden="true" className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors", delayed ? "bg-primary" : "bg-muted")}>
            <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-card transition-transform", delayed ? "translate-x-5" : "translate-x-1")} />
          </span>
        </Button>
      </div>

      <div className="mt-7 grid items-center gap-7 md:grid-cols-[1.15fr_auto_1fr] md:gap-6">
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-sans text-base font-semibold">{t("landing.queue")}</h3>
            <span className="text-xs text-muted-foreground">{t("landing.patients")}</span>
          </div>
          <div className="divide-y divide-border border-y border-border" aria-live="polite">
            {patients.map((patient) => (
              <div key={patient.name} className="flex min-h-20 items-center gap-3 py-4">
                <div className="w-16 shrink-0 tabular-nums">
                  <p key={`${patient.time}-${delayed}`} className={cn("preview-time text-lg font-semibold", delayed && "text-risk-high")}>{previewTime(patient.time, delayed)}</p>
                  {delayed && <del className="text-xs text-muted-foreground" aria-label={t("landing.original")}>{patient.time}</del>}
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-peach-soft text-sm font-semibold" aria-hidden="true">{patient.name.charAt(0)}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{patient.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><patient.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{patient.status}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={cn("mt-3 flex items-center gap-2 text-xs font-medium", delayed ? "text-risk-high" : "text-risk-low")}>
            {delayed ? <TriangleAlert className="h-4 w-4" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
            {t(delayed ? "landing.delayed" : "landing.onTime")}
          </p>
        </div>

        <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-muted-foreground md:rotate-0" aria-hidden="true" />

        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground"><MessageSquareText className="h-4 w-4" aria-hidden="true" />{t("landing.patientView")}</p>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3"><LogoMark size={24} /><span className="text-sm font-semibold">ClinicPing</span></div>
            <div className="min-h-52 p-5" aria-live="polite" aria-atomic="true">
              <div key={String(delayed)} className="preview-message">
                <p className="mb-3 text-xs font-semibold text-muted-foreground">{t(delayed ? "landing.delayUpdate" : "landing.reminder")}</p>
                <p className="text-base leading-relaxed">{t(delayed ? "landing.delayMessage" : "landing.message", { time: previewTime("9:30", delayed) })}</p>
                <CheckCheck className="ml-auto mt-4 h-4 w-4 text-risk-low" aria-hidden="true" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{t("landing.previewOnly")}</p>
        </div>
      </div>
    </section>
  );
}