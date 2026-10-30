/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";
import { useI18n } from "@/lib/i18n";

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
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return <Placeholder title={t("nav.calendar")} />;
}
