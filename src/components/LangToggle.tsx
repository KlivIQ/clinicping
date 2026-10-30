/*
 * ClinicPing — © 2026 KlivIQ Technologies. All rights reserved.
 * Built by KlivIQ Technologies.
 */
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div role="group" aria-label="Language" className="inline-flex rounded-full border border-border bg-card p-1">
      {(["en", "ta"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "min-h-10 min-w-12 rounded-full px-3 text-sm font-medium transition-colors",
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          {l === "en" ? "EN" : "தமிழ்"}
        </button>
      ))}
    </div>
  );
}

export function Credit() {
  const { t } = useI18n();
  return <p className="py-6 text-center text-xs text-muted-foreground">{t("footer.credit")}</p>;
}
