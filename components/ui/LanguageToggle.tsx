"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";
import type { Locale } from "@/lib/i18n/translations";

const OPTIONS: Locale[] = ["nl", "en"];

/** Small segmented NL/EN switch, styled for the app's dark chrome
 * (sidebar, mobile header, customer-page banner) — the only places it
 * appears. */
export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={`inline-flex shrink-0 items-center rounded-full border border-white/15 p-0.5 ${className}`}>
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase transition-colors duration-150 ${
            locale === option ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
