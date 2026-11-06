/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Quick-add appointment: one patient search field, smart defaults, conflict prevention (demo only).
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, UserPlus, X } from "lucide-react";
import { ScreenHeader } from "@/components/Placeholder";
import { useI18n } from "@/lib/i18n";
import { useClinicDemo } from "@/lib/mock-data";
import { addAppointment, freeSlots, localDate, validateNew } from "@/lib/clinic-demo";
import { formatClock } from "@/lib/time-format";
import type { Lang } from "@/lib/models";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_clinic/add")({
  validateSearch: (s: Record<string, unknown>): { date?: string; time?: string } => ({
    ...(typeof s['date'] === "string" ? { date: s['date'] } : {}),
    ...(typeof s['time'] === "string" ? { time: s['time'] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Quick add — ClinicPing" },
      { name: "description", content: "Add an appointment in three taps." },
      { property: "og:title", content: "Quick add — ClinicPing" },
      { property: "og:description", content: "Add an appointment in three taps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Add,
});

const input = "min-h-12 w-full rounded-xl border border-border bg-card px-3";
const chip = "min-h-12 rounded-full border px-4 text-sm font-medium";
const plusDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return localDate(d); };

function Add() {
  const { t, lang: uiLang } = useI18n();
  const nav = useNavigate();
  const search = Route.useSearch();
  const { state, setState } = useClinicDemo();
  const todayKey = plusDays(0);
  const tomorrowKey = plusDays(1);
  const [query, setQuery] = useState("");
  const [patientId, setPatientId] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [lang, setLang] = useState<Lang>(state.settings.defaultReminderLang);
  const [date, setDate] = useState(search.date ?? todayKey);
  const [otherDate, setOtherDate] = useState(!!search.date && search.date !== todayKey && search.date !== tomorrowKey);
  const [picked, setPicked] = useState<string | null>(search.time ?? null);
  const [fee, setFee] = useState(String(state.settings.defaultFeeInr));
  const [error, setError] = useState<string | null>(null);

  const selected = state.patients.find((p) => p.id === patientId);
  const q = query.trim().toLowerCase();
  const digits = query.replace(/\D/g, "");
  const matches = useMemo(() => !q || selected ? [] : state.patients.filter((p) =>
    p.fullName.toLowerCase().includes(q) || (digits.length >= 3 && p.phone.includes(digits))).slice(0, 5), [q, digits, selected, state.patients]);
  const isNew = !selected && q.length > 0;

  const slots = freeSlots(date, state.settings, state.appointments);
  const nextFree = slots[0] ?? "";
  const slot = picked && slots.includes(picked) ? picked : nextFree;

  const choosePatient = (id: string) => {
    const p = state.patients.find((x) => x.id === id)!;
    setPatientId(id); setQuery(p.fullName); setLang(p.preferredLang); setError(null);
  };
  const clearPatient = () => { setPatientId(null); setQuery(""); setLang(state.settings.defaultReminderLang); };
  const onQuery = (v: string) => {
    setQuery(v); setPatientId(null); setError(null);
    // Typing a number for a new patient fills the mobile field too.
    const d = v.replace(/\D/g, "");
    if (d.length >= 10 && d.length === v.replace(/[\s+-]/g, "").length) setPhone(d.slice(-10));
  };
  const pickDate = (d: string) => { setDate(d); setPicked(null); };

  const save = () => {
    if (!slot) return setError(t("add.closed"));
    const nameIsNumber = /^\+?[\d\s-]+$/.test(query.trim());
    const n = { patientId: selected?.id, name: nameIsNumber ? "" : query, phone, lang, startsAt: new Date(`${date}T${slot}`).toISOString(), feeInr: Number(fee) };
    const err = validateNew(state, n);
    if (err) return setError(t(`add.${err}`));
    const next = addAppointment(state, n);
    const newId = next.appointments[next.appointments.length - 1]!.id;
    setState(next);
    if (date === todayKey) nav({ to: "/today", search: { added: newId } });
    else nav({ to: "/calendar" });
  };

  return (
    <>
      <ScreenHeader title={t("add.title")} />
      <div className="space-y-5 px-5 pb-24">
        <div className="relative space-y-1">
          <label htmlFor="patient-q" className="text-sm font-medium">{t("add.search")}</label>
          <div className="relative">
            <input id="patient-q" autoFocus autoComplete="off" value={query} onChange={(e) => onQuery(e.target.value)} className={cn(input, "pr-12")} />
            {query && <button aria-label={t("common.close")} onClick={clearPatient} className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center"><X className="h-4 w-4" /></button>}
          </div>
          {matches.length > 0 && (
            <ul role="listbox" className="overflow-hidden rounded-xl border border-border bg-card">
              {matches.map((p) => (
                <li key={p.id}>
                  <button role="option" aria-selected={false} onClick={() => choosePatient(p.id)} className="flex min-h-12 w-full items-center justify-between gap-2 px-3 text-left hover:bg-muted">
                    <span className="font-medium">{p.fullName}</span>
                    <span className="text-sm tabular-nums text-muted-foreground">{p.phone.replace("+91", "")}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selected && <p className="text-sm text-muted-foreground">{selected.phone} · {t(`lang.${selected.preferredLang}`)}</p>}
        </div>

        {isNew && (
          <div className="space-y-1">
            <p className="flex items-center gap-1 text-sm font-medium"><UserPlus className="h-4 w-4" /> {t("add.newHint")} · {t("add.phone")}</p>
            <div className="flex items-center rounded-xl border border-border bg-card">
              <span className="pl-3 pr-1 text-muted-foreground">+91</span>
              <input aria-label={t("add.phone")} inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className="min-h-12 w-full rounded-xl bg-transparent px-2 outline-none tabular-nums" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-sm font-medium">{t("add.date")}</span>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => { pickDate(todayKey); setOtherDate(false); }} className={cn(chip, date === todayKey && !otherDate ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>{t("add.today")}</button>
            <button onClick={() => { pickDate(tomorrowKey); setOtherDate(false); }} className={cn(chip, date === tomorrowKey && !otherDate ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>{t("add.tomorrow")}</button>
            <button onClick={() => setOtherDate(true)} className="min-h-12 px-2 text-sm font-medium underline underline-offset-4">{t("add.otherDate")}</button>
          </div>
          {otherDate && <input type="date" min={todayKey} value={date} onChange={(e) => e.target.value && pickDate(e.target.value)} className={input} />}
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">{t("add.time")} · {t("add.slot", { n: String(state.settings.slotMinutes) })}</span>
          {slots.length === 0 ? <p className="text-sm text-muted-foreground">{t("add.closed")}</p> : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((s) => (
                <button key={s} onClick={() => setPicked(s)} className={cn("relative min-h-12 rounded-xl border text-sm tabular-nums", slot === s ? "border-peach bg-peach font-semibold text-accent-foreground" : "border-border bg-card")}>
                  {formatClock(s, uiLang)}
                  {s === nextFree && <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{t("add.nextFree")}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <details className="rounded-2xl border border-border bg-card px-3">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-medium">
            <span>{t("add.more")} <span className="font-normal text-muted-foreground">· {t(`lang.${lang}`)} · ₹{fee || 0}</span></span>
            <ChevronDown className="h-4 w-4" />
          </summary>
          <div className="space-y-4 pb-3">
            <div className="space-y-1"><span className="text-sm font-medium">{t("add.language")}</span>
              <div className="grid grid-cols-2 gap-2">
                {(["ta", "en"] as const).map((l) => <button key={l} onClick={() => setLang(l)} className={cn("min-h-12 rounded-xl border text-sm font-medium", lang === l ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>{t(`lang.${l}`)}</button>)}
              </div>
            </div>
            <label className="block space-y-1"><span className="text-sm font-medium">{t("add.fee")}</span><input inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value.replace(/\D/g, ""))} className={input} /></label>
          </div>
        </details>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-10 border-t border-border bg-background/95 px-5 py-3">
        <div className="mx-auto max-w-md space-y-2">
          {error && <p role="alert" className="text-sm text-risk-high">{error}</p>}
          <button onClick={save} className="min-h-12 w-full rounded-full bg-primary font-medium text-primary-foreground">
            {t("add.save")}{slot ? ` · ${formatClock(slot, uiLang)}` : ""}
          </button>
        </div>
      </div>
    </>
  );
}
