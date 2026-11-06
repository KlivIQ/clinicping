/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./models";
import { phase2En } from "./phase2-copy";
import { ta } from "./copy-ta";

const en = {
  "brand.tagline": "Your clinic day, on one screen.",
  "landing.headline": "Fewer empty chairs. Calmer days.",
  "landing.sub": "See today's patients at a glance, know who might not turn up, and remind them in their own language.",
  "landing.cta": "Start in 2 minutes",
  "landing.login": "I already have an account",
  "landing.signIn": "Sign in",
  "landing.f1.t": "One screen for the day",
  "landing.f1.d": "Every appointment in time order. Faster than a paper diary.",
  "landing.f2.t": "Know who to call first",
  "landing.f2.d": "Plain reasons like “First visit, booked 6 days ago”. No confusing scores.",
  "landing.f3.t": "Reminders in Tamil or English",
  "landing.f3.d": "Patients hear from you in the language they read.",
  "landing.demo": "Demo: phone {phone}, OTP {otp}",
  "footer.credit": "Built by KlivIQ Technologies",
  "login.title": "Enter your mobile number",
  "login.sub": "We'll send a 6-digit code by SMS.",
  "login.phone": "Mobile number",
  "login.send": "Send code",
  "login.demo": "Use demo account",
  "otp.title": "Enter the code",
  "otp.sub": "Sent to +91 {phone}",
  "otp.verify": "Verify",
  "otp.wrong": "That code didn't match. Try {otp} for the demo.",
  "otp.change": "Change number",
  "onb.title": "What's your name?",
  "onb.sub": "We'll set up your practice with it.",
  "onb.name": "Your name",
  "onb.ready": "Your practice is ready",
  "onb.readySub": "We've filled in common clinic hours. Change them any time in Settings.",
  "onb.hours": "Mon–Sat · 9:00–1:00, 5:00–8:00",
  "onb.slots": "15-minute slots",
  "onb.go": "Open today",
  "onb.next": "Continue",
  "back": "Back",
  "nav.today": "Today",
  "nav.calendar": "Calendar",
  "nav.add": "Add",
  "nav.reminders": "Reminders",
  "nav.settings": "Settings",
  "soon": "Coming in the next phase",
  "today.callFirst": "Call first",
  "today.all": "All appointments",
  "risk.high": "High",
  "risk.medium": "Medium",
  "risk.low": "Low",
  "risk.regular": "Regular patient",
  "risk.firstVisitOld": "First visit, booked 6 days ago",
  "risk.pastNoShows": "Missed 2 of last 3 visits",
  "risk.confirmed": "Confirmed on WhatsApp",
  "risk.noReply": "No reply to reminder",
  "risk.rescheduled": "Rescheduled once",
  "src.whatsapp": "WhatsApp",
  "src.manual": "Manual",
  "status.booked": "Booked",
  "status.done": "Done",
  "settings.lang": "Language",
  "settings.logout": "Sign out",
  "settings.addStaff": "Add staff",
  "call": "Call",
  "landing.intro": "Appointments. Reminders. A calmer clinic.",
  "landing.simpleSub": "Keep your patient queue in order and everyone informed — in Tamil or English.",
  "landing.preview": "A little look at your clinic day",
  "landing.previewLabel": "Interactive preview · sample patients",
  "landing.delay": "Doctor running 15 min late",
  "landing.tryIt": "Tap to try it",
  "landing.onTime": "On schedule",
  "landing.delayed": "15-minute delay",
  "landing.queue": "Today's queue",
  "landing.patients": "3 patients",
  "landing.patient1": "Arjun Mehta",
  "landing.patient2": "Lakshmi Kumar",
  "landing.patient3": "Ravi Shankar",
  "landing.waiting": "Waiting",
  "landing.confirmed": "Confirmed",
  "landing.next": "Up next",
  "landing.patientView": "On your patient's phone",
  "landing.reminder": "Appointment reminder",
  "landing.delayUpdate": "Updated appointment",
  "landing.message": "Hello Arjun, your clinic appointment is at {time} today. See you soon!",
  "landing.delayMessage": "Hello Arjun, the doctor is running 15 minutes late. Your appointment is now at {time}. Thank you for your patience.",
  "landing.original": "Original time",
  "landing.previewOnly": "Preview only — no messages are sent",
  "landing.benefit1": "A clear queue",
  "landing.benefit1Sub": "Know who's next, without searching a diary.",
  "landing.benefit2": "Fewer surprises",
  "landing.benefit2Sub": "See who may miss their visit and who to call first.",
  "landing.benefit3": "Patients kept in the loop",
  "landing.benefit3Sub": "Appointment updates in the language they read.",
  ...phase2En,
};
type Key = keyof typeof en;



type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: Key, vars?: Record<string, string>) => string };
const I18n = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const s = localStorage.getItem("cp.lang");
    if (s === "en" || s === "ta") setLangState(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("cp.lang", l);
  };
  const t = (k: Key, vars?: Record<string, string>) => {
    let s = (lang === "ta" ? ta : en)[k] ?? k;
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b);
    return s;
  };
  return <I18n.Provider value={{ lang, setLang, t }}>{children}</I18n.Provider>;
}

export function useI18n() {
  const c = useContext(I18n);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}
export type I18nKey = Key;
