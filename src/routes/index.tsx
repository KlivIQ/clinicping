/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, PhoneCall, MessageSquareText } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Credit, LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import { DEMO_OTP, DEMO_PHONE } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ClinicPing — Your clinic day on one screen" },
      { name: "description", content: "See today's patients, know who may miss, and send reminders in Tamil or English." },
      { property: "og:title", content: "ClinicPing — Your clinic day on one screen" },
      { property: "og:description", content: "Fewer missed appointments for Indian doctors and small clinics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useI18n();
  const features = [
    { icon: CalendarClock, t: t("landing.f1.t"), d: t("landing.f1.d") },
    { icon: PhoneCall, t: t("landing.f2.t"), d: t("landing.f2.d") },
    { icon: MessageSquareText, t: t("landing.f3.t"), d: t("landing.f3.d") },
  ];
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5">
      <header className="flex items-center justify-between py-4">
        <Logo />
        <LangToggle />
      </header>

      <main className="flex-1 pt-8">
        <p className="text-sm font-medium text-muted-foreground">{t("brand.tagline")}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">{t("landing.headline")}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t("landing.sub")}</p>

        {/* Preview of a Today row */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="w-14 text-sm font-semibold tabular-nums">9:30</span>
            <div className="flex-1">
              <p className="font-semibold">Arjun Mehta</p>
              <p className="text-sm text-risk-high">▲ {t("risk.firstVisitOld")}</p>
            </div>
            <span className="rounded-full bg-peach px-3 py-1.5 text-sm font-medium text-accent-foreground">{t("call")}</span>
          </div>
        </div>

        <ul className="mt-10 space-y-6">
          {features.map((f) => (
            <li key={f.t} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-peach-soft">
                <f.icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">{f.t}</h2>
                <p className="text-muted-foreground">{f.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <div className="sticky bottom-0 space-y-2 bg-background pb-2 pt-6">
        <Link to="/login" className="flex min-h-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
          {t("landing.cta")}
        </Link>
        <Link to="/login" className="flex min-h-12 items-center justify-center rounded-full font-medium text-primary underline-offset-4 hover:underline">
          {t("landing.login")}
        </Link>
        <p className="text-center text-xs text-muted-foreground">{t("landing.demo", { phone: DEMO_PHONE, otp: DEMO_OTP })}</p>
      </div>
      <Credit />
    </div>
  );
}
