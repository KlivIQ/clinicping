/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Signed-in shell with thumb-reach bottom tabs.
 */
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, Home, Plus, BellRing, Settings } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getSession } from "@/lib/session";

export const Route = createFileRoute("/_clinic")({ component: ClinicLayout });

function ClinicLayout() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!getSession()) nav({ to: "/login" });
    else setOk(true);
  }, [nav]);
  if (!ok) return null;

  const tabs = [
    { to: "/today", icon: Home, label: t("nav.today") },
    { to: "/calendar", icon: CalendarDays, label: t("nav.calendar") },
    { to: "/add", icon: Plus, label: t("nav.add"), primary: true },
    { to: "/reminders", icon: BellRing, label: t("nav.reminders") },
    { to: "/settings", icon: Settings, label: t("nav.settings") },
  ] as const;

  return (
    <div className="mx-auto min-h-screen max-w-md pb-24">
      <Outlet />
      <nav className="fixed inset-x-0 bottom-0 border-t border-border bg-card">
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {tabs.map((tab) => (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className="flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground"
                activeProps={{ className: "text-primary" }}
              >
                {"primary" in tab ? (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-peach text-accent-foreground"><tab.icon className="h-5 w-5" /></span>
                ) : (
                  <tab.icon className="h-6 w-6" />
                )}
                <span className="max-w-full truncate px-1">{tab.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
