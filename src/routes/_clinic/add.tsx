/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";
import { useI18n } from "@/lib/i18n";

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
  component: Page,
});

function Page() {
  const { t } = useI18n();
  return <Placeholder title={t("nav.add")} />;
}
