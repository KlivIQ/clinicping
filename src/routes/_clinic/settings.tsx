/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Settings: clinic, hours, slots, breaks, days off, language, WhatsApp, staff. Saved in the demo session only.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Check, ChevronDown, MessageCircle, Plus, Trash2, UserPlus } from "lucide-react";
import { ScreenHeader } from "@/components/Placeholder";
import { LangToggle } from "@/components/LangToggle";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { useClinicDemo } from "@/lib/mock-data";
import { localDate, updateSettings } from "@/lib/clinic-demo";
import type { ClinicSettings, DayHours, Lang, SlotMinutes } from "@/lib/models";
import { clearSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_clinic/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ClinicPing" },
      { name: "description", content: "Working hours, slots, language and WhatsApp." },
      { property: "og:title", content: "Settings — ClinicPing" },
      { property: "og:description", content: "Working hours, slots, language and WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Settings,
});

const input = "min-h-12 w-full rounded-xl border border-border bg-card px-3";
const timeInput = "min-h-12 rounded-xl border border-border bg-card px-2 tabular-nums";
const pill = "min-h-12 rounded-full border px-4 text-sm font-medium";
const on = "border-primary bg-primary text-primary-foreground";
const off = "border-border bg-card";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Settings() {
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const { state, setState } = useClinicDemo();
  const s = state.settings;
  const set = (patch: Partial<ClinicSettings>) => setState((st) => updateSettings(st, patch));
  const setDay = (weekday: number, patch: Partial<DayHours>) => set({ hours: s.hours.map((h) => (h.weekday === weekday ? { ...h, ...patch } : h)) });
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [staffOpen, setStaffOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffMsg, setStaffMsg] = useState<"ok" | "bad" | null>(null);
  const loc = lang === "ta" ? "ta-IN" : "en-IN";
  const fmtDate = (d: string) => new Date(`${d}T12:00`).toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" });
  const order = [1, 2, 3, 4, 5, 6, 0];

  const addDayOff = () => {
    if (!from) return;
    const end = to && to >= from ? to : from;
    set({ daysOff: [...s.daysOff, { id: crypto.randomUUID(), from, to: end }] });
    setFrom(""); setTo("");
  };
  const saveInvite = () => {
    if (!staffName.trim() || !/^[6-9]\d{9}$/.test(staffPhone)) return setStaffMsg("bad");
    set({ staffInvites: [...s.staffInvites, { id: crypto.randomUUID(), practiceId: "prc_1", name: staffName.trim(), phone: `+91${staffPhone}`, role: "assistant", createdAt: new Date().toISOString() }] });
    setStaffName(""); setStaffPhone(""); setStaffMsg("ok");
  };

  return (
    <>
      <ScreenHeader title={t("nav.settings")} right={<LangToggle />} />
      <div className="space-y-4 px-5">
        <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">{t("demo.notice")}</p>

        <Section title={t("settings.clinic")}>
          <label className="block space-y-1"><span className="text-sm font-medium">{t("settings.practiceName")}</span>
            <input value={s.practiceName} onChange={(e) => set({ practiceName: e.target.value })} className={input} /></label>
          <label className="block space-y-1"><span className="text-sm font-medium">{t("settings.address")} <span className="font-normal text-muted-foreground">({t("settings.optional")})</span></span>
            <input value={s.address ?? ""} onChange={(e) => set({ address: e.target.value })} className={input} /></label>
          <label className="block space-y-1"><span className="text-sm font-medium">{t("settings.regNo")} <span className="font-normal text-muted-foreground">({t("settings.optional")})</span></span>
            <input value={s.registrationNo ?? ""} onChange={(e) => set({ registrationNo: e.target.value })} className={input} /></label>
        </Section>

        <Section title={t("settings.hours")}>
          <ul className="space-y-3">
            {order.map((wd) => {
              const h = s.hours.find((x) => x.weekday === wd)!;
              return (
                <li key={wd} className="space-y-2 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{t(`weekday.${wd}` as I18nKey)}</span>
                    <label className="flex min-h-12 items-center gap-2 text-sm">
                      <input type="checkbox" checked={h.closed} onChange={(e) => setDay(wd, { closed: e.target.checked })} className="h-5 w-5 accent-[var(--inkberry)]" />
                      {t("settings.closedToggle")}
                    </label>
                  </div>
                  {!h.closed && (
                    <div className="flex items-center gap-2 text-sm">
                      <input type="time" aria-label={`${t(`weekday.${wd}` as I18nKey)} ${t("settings.opens")}`} value={h.opensAt} onChange={(e) => e.target.value && setDay(wd, { opensAt: e.target.value })} className={timeInput} />
                      <span>–</span>
                      <input type="time" aria-label={`${t(`weekday.${wd}` as I18nKey)} ${t("settings.closes")}`} value={h.closesAt} onChange={(e) => e.target.value && setDay(wd, { closesAt: e.target.value })} className={timeInput} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title={t("settings.slots")}>
          <span className="text-sm font-medium">{t("settings.slotLength")}</span>
          <div className="grid grid-cols-4 gap-2">
            {([10, 15, 20, 30] as SlotMinutes[]).map((m) => (
              <button key={m} onClick={() => set({ slotMinutes: m })} className={cn("min-h-12 rounded-xl border text-sm font-medium", s.slotMinutes === m ? on : off)}>{t("settings.minutes", { n: String(m) })}</button>
            ))}
          </div>
          <label className="block space-y-1"><span className="text-sm font-medium">{t("settings.fee")}</span>
            <input inputMode="numeric" value={String(s.defaultFeeInr)} onChange={(e) => set({ defaultFeeInr: Number(e.target.value.replace(/\D/g, "") || 0) })} className={input} /></label>
        </Section>

        <Section title={t("settings.breaks")}>
          {s.breaks.length === 0 && <p className="text-sm text-muted-foreground">{t("settings.noBreaks")}</p>}
          <ul className="space-y-2">
            {s.breaks.map((b) => (
              <li key={b.id} className="flex items-center gap-2 text-sm">
                <input type="time" aria-label={t("settings.from")} value={b.startsAt} onChange={(e) => e.target.value && set({ breaks: s.breaks.map((x) => x.id === b.id ? { ...x, startsAt: e.target.value } : x) })} className={timeInput} />
                <span>–</span>
                <input type="time" aria-label={t("settings.to")} value={b.endsAt} onChange={(e) => e.target.value && set({ breaks: s.breaks.map((x) => x.id === b.id ? { ...x, endsAt: e.target.value } : x) })} className={timeInput} />
                <button aria-label={t("settings.removeBreak")} onClick={() => set({ breaks: s.breaks.filter((x) => x.id !== b.id) })} className="ml-auto flex h-12 w-12 items-center justify-center rounded-full hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
          <button onClick={() => set({ breaks: [...s.breaks, { id: crypto.randomUUID(), startsAt: "13:00", endsAt: "14:00" }] })} className={cn(pill, off, "flex items-center gap-2")}><Plus className="h-4 w-4" /> {t("settings.addBreak")}</button>
        </Section>

        <Section title={t("settings.daysOff")}>
          {s.daysOff.length === 0 && <p className="text-sm text-muted-foreground">{t("settings.noDaysOff")}</p>}
          <ul className="space-y-2">
            {s.daysOff.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{fmtDate(d.from)}{d.to !== d.from ? ` – ${fmtDate(d.to)}` : ""}</span>
                <button aria-label={t("settings.remove")} onClick={() => set({ daysOff: s.daysOff.filter((x) => x.id !== d.id) })} className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-2">
            <label className="space-y-1 text-sm"><span className="font-medium">{t("settings.from")}</span><input type="date" min={localDate(new Date())} value={from} onChange={(e) => setFrom(e.target.value)} className={input} /></label>
            <label className="space-y-1 text-sm"><span className="font-medium">{t("settings.toOptional")}</span><input type="date" min={from || localDate(new Date())} value={to} onChange={(e) => setTo(e.target.value)} className={input} /></label>
          </div>
          <button disabled={!from} onClick={addDayOff} className={cn(pill, on, "disabled:opacity-40")}>{t("settings.addDayOff")}</button>
        </Section>

        <Section title={t("settings.lang")}>
          <div className="flex min-h-12 items-center justify-between gap-2">
            <span className="text-sm font-medium">{t("settings.appLang")}</span>
            <LangToggle />
          </div>
          <span className="block text-sm font-medium">{t("settings.patientLang")}</span>
          <div className="grid grid-cols-2 gap-2">
            {(["ta", "en"] as Lang[]).map((l) => (
              <button key={l} onClick={() => set({ defaultReminderLang: l })} className={cn("min-h-12 rounded-xl border text-sm font-medium", s.defaultReminderLang === l ? on : off)}>{t(`lang.${l}`)}</button>
            ))}
          </div>
        </Section>

        <Section title={t("settings.whatsapp")}>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-peach-soft"><MessageCircle className="h-5 w-5" /></span>
            <div>
              <p className="flex items-center gap-1 font-medium"><Check className="h-4 w-4" /> {t("settings.waConnected")}</p>
              <p className="text-sm text-muted-foreground">{t("settings.waSub")}</p>
            </div>
          </div>
        </Section>

        <button onClick={() => { clearSession(); nav({ to: "/" }); }} className="min-h-12 w-full rounded-full border border-border font-medium">
          {t("settings.logout")}
        </button>

        <div className="rounded-2xl border border-border bg-card">
          <button aria-expanded={staffOpen} onClick={() => setStaffOpen(!staffOpen)} className="flex min-h-12 w-full items-center justify-between gap-2 px-4 font-medium">
            <span className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> {t("settings.addStaff")}</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", staffOpen && "rotate-180")} />
          </button>
          {staffOpen && (
            <div className="space-y-3 px-4 pb-4">
              <label className="block space-y-1"><span className="text-sm font-medium">{t("settings.staffName")}</span>
                <input value={staffName} onChange={(e) => { setStaffName(e.target.value); setStaffMsg(null); }} className={input} /></label>
              <label className="block space-y-1"><span className="text-sm font-medium">{t("add.phone")}</span>
                <div className="flex items-center rounded-xl border border-border bg-card">
                  <span className="pl-3 pr-1 text-muted-foreground">+91</span>
                  <input inputMode="numeric" maxLength={10} value={staffPhone} onChange={(e) => { setStaffPhone(e.target.value.replace(/\D/g, "")); setStaffMsg(null); }} className="min-h-12 w-full rounded-xl bg-transparent px-2 tabular-nums outline-none" />
                </div></label>
              {staffMsg === "bad" && <p role="alert" className="text-sm text-risk-high">{t("settings.invalidStaff")}</p>}
              {staffMsg === "ok" && <p role="status" className="flex items-center gap-1 text-sm font-medium"><Check className="h-4 w-4" /> {t("settings.inviteSaved")}</p>}
              <button onClick={saveInvite} className={cn(pill, on, "w-full")}>{t("settings.sendInvite")}</button>
              {s.staffInvites.length > 0 && (
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {s.staffInvites.map((i) => <li key={i.id}>{i.name} · {i.phone}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
