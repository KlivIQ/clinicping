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
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingPreview } from "@/components/LandingPreview";
import clinicReception from "@/assets/clinic-reception.jpg";

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
    { icon: CalendarClock, t: t("landing.benefit1"), d: t("landing.benefit1Sub") },
    { icon: PhoneCall, t: t("landing.benefit2"), d: t("landing.benefit2Sub") },
    { icon: MessageSquareText, t: t("landing.benefit3"), d: t("landing.benefit3Sub") },
  ];
  return (
    <div className="landing-page min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <Logo />
        <LangToggle />
      </header>

      <main>
        <section className="landing-hero relative isolate overflow-hidden border-y border-border">
          <img src={clinicReception} alt="" width={1536} height={768} fetchPriority="high" className="landing-hero-photo absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="landing-hero-veil absolute inset-0 -z-10" />
          <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
            <div className="max-w-lg">
              <p className="text-sm font-medium text-muted-foreground">{t("landing.intro")}</p>
              <h1 className="mt-3 text-5xl font-semibold leading-tight sm:text-6xl">ClinicPing</h1>
              <p className="mt-4 max-w-sm font-display text-2xl font-medium leading-snug sm:text-3xl">{t("landing.headline")}</p>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">{t("landing.simpleSub")}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Button asChild className="min-h-12 rounded-full px-6 text-base shadow-none"><Link to="/login">{t("landing.cta")}<ArrowUpRight aria-hidden="true" /></Link></Button>
                <Button asChild variant="link" className="h-auto min-h-12 whitespace-normal px-0"><Link to="/login">{t("landing.login")}</Link></Button>
              </div>
            </div>
          </div>
        </section>
        <LandingPreview />
        <ul className="mx-auto grid max-w-5xl gap-7 border-t border-border px-5 py-9 sm:grid-cols-3 sm:px-8">
          {features.map((f) => (
            <li key={f.t} className="flex gap-3 sm:flex-col">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-peach-soft">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">{f.t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <footer className="border-t border-border px-5 pt-5">
        <p className="text-center text-xs text-muted-foreground">{t("landing.demo", { phone: DEMO_PHONE, otp: DEMO_OTP })}</p>
        <Credit />
      </footer>
    </div>
  );
}
