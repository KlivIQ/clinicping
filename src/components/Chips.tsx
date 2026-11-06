/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Risk and status chips shared by Today and Calendar. Risk uses its own colour-blind-safe set, never brand colours.
 */
import { AlertTriangle, Check, Circle, Contrast } from "lucide-react";
import { useI18n, type I18nKey } from "@/lib/i18n";
import type { Appointment, RiskLevel } from "@/lib/models";
import { cn } from "@/lib/utils";

const riskStyle: Record<RiskLevel, { cls: string; Icon: typeof Circle }> = {
  high: { cls: "bg-risk-high-bg text-risk-high", Icon: AlertTriangle },
  medium: { cls: "bg-risk-medium-bg text-risk-medium", Icon: Contrast },
  low: { cls: "bg-risk-low-bg text-risk-low", Icon: Circle },
};

export function RiskChip({ level }: { level: RiskLevel }) {
  const { t } = useI18n();
  const { cls, Icon } = riskStyle[level];
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium", cls)}>
      <Icon className="h-3 w-3" aria-hidden /> {t(`risk.${level}` as I18nKey)}
    </span>
  );
}

export function useStatusLabel(consultationId: string | null) {
  const { t } = useI18n();
  return (a: Appointment) =>
    consultationId === a.id ? t("queue.consultation")
      : a.status === "done" ? t("queue.completed")
      : a.status === "booked" ? t("queue.upcoming")
      : t(`status.${a.status}` as I18nKey);
}

export function StatusChip({ appt, consultationId }: { appt: Appointment; consultationId: string | null }) {
  const label = useStatusLabel(consultationId)(appt);
  const done = appt.status === "done";
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium",
      consultationId === appt.id ? "border-primary text-primary" : "border-border text-muted-foreground")}>
      {done && <Check className="h-3 w-3" aria-hidden />} {label}
    </span>
  );
}
