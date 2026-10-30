/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Mock phone + OTP login, then onboarding (name → practice ready).
 */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Credit, LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import { DEMO_OTP, DEMO_PHONE, demoDoctor } from "@/lib/mock-data";
import { isDemo, isValidPhone, saveSession, verifyOtp } from "@/lib/session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ClinicPing" },
      { name: "description", content: "Sign in to ClinicPing with your mobile number." },
      { property: "og:title", content: "Sign in — ClinicPing" },
      { property: "og:description", content: "Sign in with your mobile number and a one-time code." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

const input = "min-h-14 w-full rounded-xl border border-input bg-card px-4 text-lg outline-none focus:border-primary focus:ring-2 focus:ring-ring/20";
const primaryBtn = "flex min-h-14 w-full items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground disabled:opacity-40";

function Login() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [step, setStep] = useState<"phone" | "otp" | "name" | "ready">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState(false);
  const digits = phone.replace(/\D/g, "");

  const verify = () => {
    if (!verifyOtp(digits, otp)) return setErr(true);
    if (isDemo(digits)) {
      saveSession({ phone: digits, name: demoDoctor.fullName });
      nav({ to: "/today" });
    } else setStep("name");
  };
  const back = () => setStep(step === "otp" ? "phone" : step === "name" ? "otp" : "phone");

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5">
      <header className="flex items-center justify-between py-4">
        {step === "phone" ? (
          <Link to="/" aria-label={t("back")} className="flex h-12 w-12 items-center justify-center rounded-full"><ArrowLeft /></Link>
        ) : (
          <button onClick={back} aria-label={t("back")} className="flex h-12 w-12 items-center justify-center rounded-full"><ArrowLeft /></button>
        )}
        <LangToggle />
      </header>

      <main className="flex-1 pt-6">
        {step === "phone" && (
          <form onSubmit={(e) => { e.preventDefault(); if (isValidPhone(digits)) setStep("otp"); }} className="space-y-6">
            <Logo />
            <div>
              <h1 className="text-3xl font-semibold">{t("login.title")}</h1>
              <p className="mt-2 text-muted-foreground">{t("login.sub")}</p>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">{t("login.phone")}</span>
              <div className="flex gap-2">
                <span className="flex min-h-14 items-center rounded-xl border border-input bg-muted px-4 text-lg">+91</span>
                <input className={input} inputMode="numeric" autoFocus maxLength={11} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98400 12345" />
              </div>
            </label>
            <button className={primaryBtn} disabled={!isValidPhone(digits)}>{t("login.send")}</button>
            <button type="button" onClick={() => { setPhone(DEMO_PHONE); setOtp(DEMO_OTP); setStep("otp"); }} className="flex min-h-12 w-full items-center justify-center rounded-full border border-border bg-peach-soft font-medium">
              {t("login.demo")}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={(e) => { e.preventDefault(); verify(); }} className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">{t("otp.title")}</h1>
              <p className="mt-2 text-muted-foreground">{t("otp.sub", { phone: digits })}</p>
            </div>
            <input className={`${input} text-center text-2xl tracking-[0.5em] tabular-nums`} inputMode="numeric" autoComplete="one-time-code" autoFocus maxLength={6} value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setErr(false); }} aria-label={t("otp.title")} />
            {err && <p role="alert" className="text-destructive">{t("otp.wrong", { otp: DEMO_OTP })}</p>}
            <button className={primaryBtn} disabled={otp.length !== 6}>{t("otp.verify")}</button>
            <button type="button" onClick={() => setStep("phone")} className="min-h-12 w-full font-medium text-primary">{t("otp.change")}</button>
          </form>
        )}

        {step === "name" && (
          <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) setStep("ready"); }} className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold">{t("onb.title")}</h1>
              <p className="mt-2 text-muted-foreground">{t("onb.sub")}</p>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">{t("onb.name")}</span>
              <div className="flex gap-2">
                <span className="flex min-h-14 items-center rounded-xl border border-input bg-muted px-4 text-lg">Dr.</span>
                <input className={input} autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ravi Kumar" />
              </div>
            </label>
            <button className={primaryBtn} disabled={!name.trim()}>{t("onb.next")}</button>
          </form>
        )}

        {step === "ready" && (
          <div className="space-y-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-peach"><Check className="h-7 w-7" /></span>
            <div>
              <h1 className="text-3xl font-semibold">{t("onb.ready")}</h1>
              <p className="mt-2 text-muted-foreground">{t("onb.readySub")}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display text-2xl font-semibold">Dr. {name.trim()}</p>
              <p className="mt-3">{t("onb.hours")}</p>
              <p className="text-muted-foreground">{t("onb.slots")}</p>
            </div>
            <button className={primaryBtn} onClick={() => { saveSession({ phone: digits, name: name.trim() }); nav({ to: "/today" }); }}>{t("onb.go")}</button>
          </div>
        )}
      </main>
      <Credit />
    </div>
  );
}
