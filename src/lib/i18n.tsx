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
  "landing.intro": "Appointments. Reminders. A calmer clinic.",
  "landing.simpleSub": "Keep your patient queue in order and everyone informed — in Tamil or English.",
  "landing.preview": "A little look at your clinic day",
  "landing.previewLabel": "Interactive preview · sample patients",
  "landing.delay": "Doctor running 15 min late",
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
  "landing.intro": "சந்திப்புகள். நினைவூட்டல்கள். அமைதியான கிளினிக்.",
  "landing.simpleSub": "நோயாளிகளின் வரிசையை ஒழுங்காக வைத்திருங்கள். தமிழ் அல்லது ஆங்கிலத்தில் தகவல் தெரிவியுங்கள்.",
  "landing.preview": "உங்கள் கிளினிக் நாளின் ஒரு பார்வை",
  "landing.previewLabel": "மாதிரிக் காட்சி · மாதிரி நோயாளிகள்",
  "landing.delay": "மருத்துவர் 15 நிமிடம் தாமதமாக வருகிறார்",
  "landing.onTime": "சரியான நேரத்தில்",
  "landing.delayed": "15 நிமிடத் தாமதம்",
  "landing.queue": "இன்றைய வரிசை",
  "landing.patients": "3 நோயாளிகள்",
  "landing.patient1": "அர்ஜுன் மேத்தா",
  "landing.patient2": "லட்சுமி குமார்",
  "landing.patient3": "ரவி சங்கர்",
  "landing.waiting": "காத்திருக்கிறார்",
  "landing.confirmed": "உறுதிசெய்தார்",
  "landing.next": "அடுத்து",
  "landing.patientView": "நோயாளியின் மொபைலில்",
  "landing.reminder": "சந்திப்பு நினைவூட்டல்",
  "landing.delayUpdate": "புதிய சந்திப்பு நேரம்",
  "landing.message": "வணக்கம் அர்ஜுன், இன்று உங்கள் கிளினிக் சந்திப்பு {time} மணிக்கு. விரைவில் சந்திப்போம்!",
  "landing.delayMessage": "வணக்கம் அர்ஜுன், மருத்துவர் 15 நிமிடம் தாமதமாக வருகிறார். உங்கள் சந்திப்பு இப்போது {time} மணிக்கு. உங்கள் பொறுமைக்கு நன்றி.",
  "landing.original": "முந்தைய நேரம்",
  "landing.previewOnly": "மாதிரிக் காட்சி மட்டுமே — செய்திகள் அனுப்பப்படாது",
  "landing.benefit1": "தெளிவான வரிசை",
  "landing.benefit1Sub": "டைரியில் தேடாமல் அடுத்த நோயாளியை அறியுங்கள்.",
  "landing.benefit2": "எதிர்பாராதவை குறைவு",
  "landing.benefit2Sub": "யார் வராமல் போகலாம், யாரை முதலில் அழைக்கலாம் என அறியுங்கள்.",
  "landing.benefit3": "நோயாளிகளுக்குத் தகவல்",
  "landing.benefit3Sub": "அவர்கள் படிக்கும் மொழியில் சந்திப்புத் தகவல்கள்.",
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
