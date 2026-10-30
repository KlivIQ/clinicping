/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { useI18n } from "@/lib/i18n";

export function ScreenHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <header className="flex min-h-16 items-center justify-between px-5 pt-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {right}
    </header>
  );
}

export function Placeholder({ title, children }: { title: string; children?: ReactNode }) {
  const { t } = useI18n();
  return (
    <>
      <ScreenHeader title={title} />
      <div className="px-5">
        {children}
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-12 text-center">
          <LogoMark size={40} />
          <p className="mt-4 text-muted-foreground">{t("soon")}</p>
        </div>
      </div>
    </>
  );
}
