/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Weekly calendar with free/booked slots and rescheduling (demo only).
 */
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScreenHeader } from "@/components/Placeholder";
import { LangToggle } from "@/components/LangToggle";
import { useI18n } from "@/lib/i18n";
import { defaultHours, useClinicDemo } from "@/lib/mock-data";
import { active, hasConflict, localDate, reschedule, slotsForDay } from "@/lib/clinic-demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_clinic/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — ClinicPing" },
      { name: "description", content: "Free and booked slots for the week." },
      { property: "og:title", content: "Calendar — ClinicPing" },
      { property: "og:description", content: "Free and booked slots for the week." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Calendar,
});

const iso = (date: string, slot: string) => new Date(`${date}T${slot}`).toISOString();

function Calendar() {
  const { t, lang } = useI18n();
  const { state, setState } = useClinicDemo();
  const [offset, setOffset] = useState(0);
  const [day, setDay] = useState(() => localDate(new Date()));
  const [moving, setMoving] = useState<string | null>(null);
  const loc = lang === "ta" ? "ta-IN" : "en-IN";
  const start = new Date(); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) + offset * 7);
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  const booked = state.appointments.filter((a) => active(a) && localDate(new Date(a.startsAt)) === day).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const free = slotsForDay(day, defaultHours).filter((s) => !hasConflict(state.appointments, iso(day, s), 15));
  const name = (id: string) => state.patients.find((p) => p.id === id)?.fullName ?? "";
  const time = (v: string) => new Date(v).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const isClosed = slotsForDay(day, defaultHours).length === 0;

  return (
    <>
      <ScreenHeader title={t("nav.calendar")} right={<LangToggle />} />
      <div className="space-y-5 px-5">
        <div className="flex items-center justify-between">
          <button aria-label={t("calendar.prev")} onClick={() => setOffset(offset - 1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-border"><ChevronLeft className="h-5 w-5" /></button>
          <p className="font-medium">{t("calendar.week", { date: week[0]!.toLocaleDateString(loc, { day: "numeric", month: "short" }) })}</p>
          <button aria-label={t("calendar.next")} onClick={() => setOffset(offset + 1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-border"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {week.map((d) => {
            const key = localDate(d);
            const count = state.appointments.filter((a) => active(a) && localDate(new Date(a.startsAt)) === key).length;
            return (
              <button key={key} onClick={() => { setDay(key); setMoving(null); }} className={cn("flex min-h-16 flex-col items-center justify-center rounded-xl text-xs", key === day ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
                <span>{d.toLocaleDateString(loc, { weekday: "narrow" })}</span>
                <span className="text-base font-semibold">{d.getDate()}</span>
                <span className="tabular-nums">{count || "·"}</span>
              </button>
            );
          })}
        </div>
        <section>
          <h2 className="mb-2 text-lg font-semibold">{t("calendar.booked")}</h2>
          {booked.length === 0 && <p className="text-sm text-muted-foreground">{t("queue.empty")}</p>}
          <ul className="space-y-2">
            {booked.map((a) => (
              <li key={a.id} className={cn("flex min-h-14 items-center gap-3 rounded-2xl border bg-card p-3", moving === a.id ? "border-primary" : "border-border")}>
                <span className="w-16 text-sm font-semibold tabular-nums">{time(a.startsAt)}</span>
                <span className="flex-1 font-medium">{name(a.patientId)}</span>
                <button onClick={() => setMoving(moving === a.id ? null : a.id)} className="min-h-12 rounded-full border border-border px-4 text-sm font-medium">{moving === a.id ? t("common.close") : t("queue.reschedule")}</button>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold">{t("calendar.available")}</h2>
          {isClosed ? <p className="text-sm text-muted-foreground">{t("calendar.closed")}</p> : free.length === 0 ? <p className="text-sm text-muted-foreground">{t("calendar.full")}</p> : (
            <div className="grid grid-cols-4 gap-2">
              {free.map((s) => (
                <button key={s} disabled={!moving} onClick={() => { if (moving) { setState((st) => reschedule(st, moving, iso(day, s))); setMoving(null); } }}
                  className={cn("min-h-12 rounded-xl border text-sm tabular-nums", moving ? "border-peach bg-peach text-accent-foreground" : "border-border bg-card")}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
