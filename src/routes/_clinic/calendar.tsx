/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Weekly calendar with a single day timeline: booked blocks plus free gaps (demo only).
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import { ScreenHeader } from "@/components/Placeholder";
import { LangToggle } from "@/components/LangToggle";
import { RiskChip, StatusChip } from "@/components/Chips";
import { useI18n } from "@/lib/i18n";
import { useClinicDemo } from "@/lib/mock-data";
import { active, daySlots as slotsFor, freeSlots, localDate, reschedule } from "@/lib/clinic-demo";
import { formatTime } from "@/lib/time-format";
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
const hhmm = (v: string) => { const d = new Date(v); return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };

function Calendar() {
  const { t, lang } = useI18n();
  const { state, setState } = useClinicDemo();
  const [offset, setOffset] = useState(0);
  const [day, setDay] = useState(() => localDate(new Date()));
  const [menuId, setMenuId] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);
  const loc = lang === "ta" ? "ta-IN" : "en-IN";
  const start = new Date(); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) + offset * 7);
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  // Same set as Today: every appointment on the day, including completed ones.
  const dayAppts = state.appointments.filter((a) => localDate(new Date(a.startsAt)) === day);
  const name = (id: string) => state.patients.find((p) => p.id === id)?.fullName ?? "";
  const time = (v: string) => formatTime(v, lang);
  const daySlots = slotsFor(day, state.settings);
  const free = freeSlots(day, state.settings, state.appointments);
  type Item = { key: string; at: string; kind: "appt"; id: string } | { key: string; at: string; kind: "free"; slot: string };
  const timeline: Item[] = [
    ...dayAppts.map((a) => ({ key: a.id, at: hhmm(a.startsAt), kind: "appt" as const, id: a.id })),
    ...free.map((s) => ({ key: `f${s}`, at: s, kind: "free" as const, slot: s })),
  ].sort((a, b) => a.at.localeCompare(b.at) || (a.kind === "appt" ? -1 : 1));
  const movingAppt = state.appointments.find((a) => a.id === moving);

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
            const count = state.appointments.filter((a) => a.status !== "cancelled" && localDate(new Date(a.startsAt)) === key).length;
            return (
              <button key={key} onClick={() => { setDay(key); setMoving(null); setMenuId(null); }} className={cn("flex min-h-16 flex-col items-center justify-center rounded-xl text-xs", key === day ? "bg-primary text-primary-foreground" : "bg-card border border-border")}>
                <span>{d.toLocaleDateString(loc, { weekday: "narrow" })}</span>
                <span className="text-base font-semibold">{d.getDate()}</span>
                <span className="tabular-nums">{count || "·"}</span>
              </button>
            );
          })}
        </div>

        {movingAppt && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-primary bg-card px-3 py-2 text-sm">
            <span>{t("calendar.pick", { name: name(movingAppt.patientId) })}</span>
            <button onClick={() => setMoving(null)} className="min-h-12 px-3 font-medium underline">{t("common.close")}</button>
          </div>
        )}

        <section>
          {daySlots.length === 0 && dayAppts.length > 0 && <p className="mb-2 text-sm text-muted-foreground">{t("calendar.closed")}</p>}
          {daySlots.length === 0 && dayAppts.length === 0 ? <p className="text-sm text-muted-foreground">{t("calendar.closed")}</p> : (
            <ol className="space-y-1.5">
              {timeline.map((it) => {
                if (it.kind === "free") {
                  const cls = "flex min-h-12 w-full items-center gap-3 rounded-xl border border-dashed px-3 text-left text-sm";
                  return (
                    <li key={it.key}>
                      {moving ? (
                        <button onClick={() => { setState((s) => reschedule(s, moving, iso(day, it.slot))); setMoving(null); }} className={cn(cls, "border-peach bg-peach-soft")}>
                          <span className="w-20 shrink-0 tabular-nums">{time(iso(day, it.slot))}</span><span>{t("calendar.free")}</span>
                        </button>
                      ) : (
                        <Link to="/add" search={{ date: day, time: it.slot }} className={cn(cls, "border-border text-muted-foreground hover:bg-card")}>
                          <span className="w-20 shrink-0 tabular-nums">{time(iso(day, it.slot))}</span><span className="flex-1">{t("calendar.freeSlot")}</span><Plus className="h-4 w-4" />
                        </Link>
                      )}
                    </li>
                  );
                }
                const a = state.appointments.find((x) => x.id === it.id)!;
                const closed = !active(a);
                return (
                  <li key={it.key} className={cn("rounded-2xl border bg-card p-3", moving === a.id ? "border-primary" : "border-border")}>
                    <div className="flex items-start gap-3">
                      <span className={cn("w-20 shrink-0 pt-0.5 text-sm font-semibold tabular-nums", closed && "text-muted-foreground")}>{time(a.startsAt)}</span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("font-semibold", closed && "font-medium text-muted-foreground")}>{name(a.patientId)}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <RiskChip level={a.riskLevel} />
                          <StatusChip appt={a} consultationId={state.consultationId} />
                        </div>
                      </div>
                      {active(a) && a.id !== state.consultationId && (
                        <button aria-label={t("queue.more")} aria-expanded={menuId === a.id} onClick={() => setMenuId(menuId === a.id ? null : a.id)} className="-my-1 -mr-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full hover:bg-muted">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    {menuId === a.id && (
                      <div className="mt-2 border-t border-border pt-2">
                        <button onClick={() => { setMoving(a.id); setMenuId(null); }} className="min-h-12 rounded-full border border-border px-4 text-sm font-medium">{t("queue.reschedule")}</button>
                      </div>
                    )}
                  </li>
                );
              })}
              {free.length === 0 && daySlots.length > 0 && <li className="text-sm text-muted-foreground">{t("calendar.full")}</li>}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}
