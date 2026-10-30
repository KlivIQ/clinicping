/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_clinic/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — ClinicPing" },
      { name: "description", content: "Reminder log for each appointment." },
      { property: "og:title", content: "Reminders — ClinicPing" },
      { property: "og:description", content: "Reminder log for each appointment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return <Placeholder title={t("nav.reminders")} />;
}
