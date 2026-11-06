/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 *
 * Header power button: asks for confirmation before signing out.
 */
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Power } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { clearSession } from "@/lib/session";

export function SignOutButton() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label={t("signout.aria")}
        onClick={() => setOpen(true)}
        className="flex h-12 w-12 items-center justify-center rounded-full text-primary hover:bg-muted"
      >
        <Power className="h-5 w-5" aria-hidden />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl bg-card p-5 pb-8"
          >
            <h2 id="signout-title" className="text-lg font-semibold">{t("signout.title")}</h2>
            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={() => { clearSession(); nav({ to: "/" }); }}
                className="min-h-12 rounded-full bg-primary font-medium text-primary-foreground"
              >
                {t("signout.confirm")}
              </button>
              <button type="button" autoFocus onClick={() => setOpen(false)} className="min-h-12 rounded-full border border-border font-medium">
                {t("signout.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
