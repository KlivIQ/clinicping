/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Credit, LangToggle } from "@/components/LangToggle";
import { Placeholder } from "@/components/Placeholder";
import { useI18n } from "@/lib/i18n";
import { clearSession, getSession } from "@/lib/session";

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

function Settings() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [name, setName] = useState("");
  useEffect(() => setName(getSession()?.name ?? ""), []);
  return (
    <>
      <Placeholder title={t("nav.settings")}>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="font-display text-xl font-semibold">Dr. {name}</p>
          <div className="mt-4 flex min-h-12 items-center justify-between">
            <span className="font-medium">{t("settings.lang")}</span>
            <LangToggle />
          </div>
        </div>
        <button onClick={() => { clearSession(); nav({ to: "/" }); }} className="mt-4 min-h-12 w-full rounded-full border border-border font-medium">
          {t("settings.logout")}
        </button>
      </Placeholder>
      {/* Hidden "Add staff" entry point — no role screens yet */}
      <button aria-label={t("settings.addStaff")} className="sr-only">{t("settings.addStaff")}</button>
      <Credit />
    </>
  );
}
