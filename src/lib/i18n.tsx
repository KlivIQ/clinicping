/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./models";

const en = {
  "brand.tagline": "Your clinic day, on one screen.",
  "landing.headline": "Fewer empty chairs. Calmer days.",
  "landing.sub": "See today's patients at a glance, know who might not turn up, and remind them in their own language.",
  "landing.cta": "Start in 2 minutes",
  "landing.login": "I already have an account",
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
};
type Key = keyof typeof en;

const ta: Record<Key, string> = {
  "brand.tagline": "உங்கள் கிளினிக் நாள், ஒரே திரையில்.",
  "landing.headline": "காலி நாற்காலிகள் குறைவு. அமைதியான நாட்கள்.",
  "landing.sub": "இன்றைய நோயாளிகளை ஒரே பார்வையில் காணுங்கள், யார் வராமல் போகலாம் என அறியுங்கள், அவர்கள் மொழியிலேயே நினைவூட்டுங்கள்.",
  "landing.cta": "2 நிமிடத்தில் தொடங்குங்கள்",
  "landing.login": "எனக்கு ஏற்கனவே கணக்கு உள்ளது",
  "landing.f1.t": "நாளுக்கு ஒரே திரை",
  "landing.f1.d": "எல்லா சந்திப்புகளும் நேர வரிசையில். காகித டைரியை விட வேகம்.",
  "landing.f2.t": "முதலில் யாரை அழைப்பது",
  "landing.f2.d": "“முதல் வருகை, 6 நாட்களுக்கு முன் பதிவு” போன்ற எளிய காரணங்கள்.",
  "landing.f3.t": "தமிழ் அல்லது ஆங்கிலத்தில் நினைவூட்டல்",
  "landing.f3.d": "நோயாளிகள் படிக்கும் மொழியிலேயே செய்தி.",
  "landing.demo": "டெமோ: எண் {phone}, OTP {otp}",
  "footer.credit": "Built by KlivIQ Technologies",
  "login.title": "உங்கள் மொபைல் எண்ணை உள்ளிடுங்கள்",
  "login.sub": "6 இலக்க குறியீட்டை SMS மூலம் அனுப்புவோம்.",
  "login.phone": "மொபைல் எண்",
  "login.send": "குறியீடு அனுப்பு",
  "login.demo": "டெமோ கணக்கைப் பயன்படுத்து",
  "otp.title": "குறியீட்டை உள்ளிடுங்கள்",
  "otp.sub": "+91 {phone} க்கு அனுப்பப்பட்டது",
  "otp.verify": "சரிபார்",
  "otp.wrong": "குறியீடு பொருந்தவில்லை. டெமோவுக்கு {otp} முயலுங்கள்.",
  "otp.change": "எண்ணை மாற்று",
  "onb.title": "உங்கள் பெயர் என்ன?",
  "onb.sub": "அதைக் கொண்டு உங்கள் கிளினிக்கை அமைப்போம்.",
  "onb.name": "உங்கள் பெயர்",
  "onb.ready": "உங்கள் கிளினிக் தயார்",
  "onb.readySub": "வழக்கமான நேரங்களை நிரப்பியுள்ளோம். அமைப்புகளில் எப்போதும் மாற்றலாம்.",
  "onb.hours": "திங்கள்–சனி · 9:00–1:00, 5:00–8:00",
  "onb.slots": "15 நிமிட இடைவெளிகள்",
  "onb.go": "இன்றைய நாளைத் திற",
  "onb.next": "தொடர்க",
  "back": "பின்செல்",
  "nav.today": "இன்று",
  "nav.calendar": "நாட்காட்டி",
  "nav.add": "சேர்",
  "nav.reminders": "நினைவூட்டல்",
  "nav.settings": "அமைப்புகள்",
  "soon": "அடுத்த கட்டத்தில் வருகிறது",
  "today.callFirst": "முதலில் அழைக்கவும்",
  "today.all": "அனைத்து சந்திப்புகள்",
  "risk.high": "அதிகம்",
  "risk.medium": "நடுத்தரம்",
  "risk.low": "குறைவு",
  "risk.regular": "வழக்கமான நோயாளி",
  "risk.firstVisitOld": "முதல் வருகை, 6 நாட்களுக்கு முன் பதிவு",
  "risk.pastNoShows": "கடந்த 3 இல் 2 வருகை தவறியது",
  "risk.confirmed": "WhatsApp இல் உறுதிசெய்தார்",
  "risk.noReply": "நினைவூட்டலுக்கு பதில் இல்லை",
  "risk.rescheduled": "ஒருமுறை மாற்றப்பட்டது",
  "src.whatsapp": "WhatsApp",
  "src.manual": "கைமுறை",
  "status.booked": "பதிவு",
  "status.done": "முடிந்தது",
  "settings.lang": "மொழி",
  "settings.logout": "வெளியேறு",
  "settings.addStaff": "பணியாளர் சேர்",
  "call": "அழை",
};

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
