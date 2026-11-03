/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Quick-add appointment with validation and conflict prevention (demo only).
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ScreenHeader } from "@/components/Placeholder";
import { useI18n } from "@/lib/i18n";
import { defaultHours, useClinicDemo } from "@/lib/mock-data";
import { addAppointment, hasConflict, localDate, slotsForDay, validateNew } from "@/lib/clinic-demo";
import type { Lang } from "@/lib/models";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_clinic/add")({
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

function Add() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { state, setState } = useClinicDemo();
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [patientId, setPatientId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [lang, setLang] = useState<Lang>("ta");
  const [date, setDate] = useState(() => localDate(new Date()));
  const [slot, setSlot] = useState("");
  const [fee, setFee] = useState("400");
  const [error, setError] = useState<string | null>(null);
  const slots = slotsForDay(date, defaultHours).filter((s) => !hasConflict(state.appointments, new Date(`${date}T${s}`).toISOString(), 15));

  const save = () => {
    if (mode === "existing" && !patientId) return setError(t("common.select"));
    if (!slot) return setError(t("add.conflict"));
    const n = { patientId: mode === "existing" ? patientId : undefined, name, phone, lang, startsAt: new Date(`${date}T${slot}`).toISOString(), feeInr: Number(fee) };
    const err = validateNew(state, n);
    if (err) return setError(t(`add.${err}`));
    setState((s) => addAppointment(s, n));
    nav({ to: "/today" });
  };

  return (
    <>
      <ScreenHeader title={t("add.title")} />
      <div className="space-y-5 px-5">
        <div className="grid grid-cols-2 gap-2 rounded-full bg-muted p-1">
          {(["new", "existing"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={cn("min-h-12 rounded-full text-sm font-medium", mode === m && "bg-card shadow-sm")}>{t(m === "new" ? "add.newPatient" : "add.existingPatient")}</button>
          ))}
        </div>
        {mode === "existing" ? (
          <label className="block space-y-1"><span className="text-sm font-medium">{t("add.patient")}</span>
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)} className={input}>
              <option value="">{t("common.select")}</option>
              {state.patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
          </label>
        ) : (
          <>
            <label className="block space-y-1"><span className="text-sm font-medium">{t("add.name")}</span><input value={name} onChange={(e) => setName(e.target.value)} className={input} /></label>
            <label className="block space-y-1"><span className="text-sm font-medium">{t("add.phone")}</span><input inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className={input} /></label>
            <div className="space-y-1"><span className="text-sm font-medium">{t("add.language")}</span>
              <div className="grid grid-cols-2 gap-2">
                {(["ta", "en"] as const).map((l) => <button key={l} onClick={() => setLang(l)} className={cn("min-h-12 rounded-xl border text-sm font-medium", lang === l ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>{t(`lang.${l}`)}</button>)}
              </div>
            </div>
          </>
        )}
        <label className="block space-y-1"><span className="text-sm font-medium">{t("add.date")}</span><input type="date" value={date} onChange={(e) => { setDate(e.target.value); setSlot(""); }} className={input} /></label>
        <div className="space-y-1"><span className="text-sm font-medium">{t("add.time")} · {t("add.slot")}</span>
          {slots.length === 0 ? <p className="text-sm text-muted-foreground">{t("add.closed")}</p> : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((s) => <button key={s} onClick={() => setSlot(s)} className={cn("min-h-12 rounded-xl border text-sm tabular-nums", slot === s ? "border-peach bg-peach text-accent-foreground" : "border-border bg-card")}>{s}</button>)}
            </div>
          )}
        </div>
        <label className="block space-y-1"><span className="text-sm font-medium">{t("add.fee")}</span><input inputMode="numeric" value={fee} onChange={(e) => setFee(e.target.value.replace(/\D/g, ""))} className={input} /></label>
        {error && <p role="alert" className="text-sm text-risk-high">{error}</p>}
        <button onClick={save} className="min-h-12 w-full rounded-full bg-primary font-medium text-primary-foreground">{t("add.save")}</button>
      </div>
    </>
  );
}
