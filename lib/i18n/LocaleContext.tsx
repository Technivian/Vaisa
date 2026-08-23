"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { translations, type Locale, type TranslationDict } from "./translations";

const LOCALE_STORAGE_KEY = "vaisa_locale";
/** The native `storage` event only fires in *other* tabs, never the tab
 * that made the write — so the toggle itself needs its own same-tab
 * signal, mirroring the pattern in lib/clientEscalations.ts. */
const LOCALE_CHANGE_EVENT = "vaisa-locale-changed";
const DEFAULT_LOCALE: Locale = "nl";

function isLocale(value: string | null): value is Locale {
  return value === "nl" || value === "en";
}

function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(stored) ? stored : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCALE_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCALE_CHANGE_EVENT, callback);
  };
}

function writeLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  } catch {
    // Storage unavailable or full — the choice just won't persist.
  }
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationDict;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * App-wide language toggle. Uses the same useSyncExternalStore + custom
 * DOM event pattern as the escalation store (lib/useRealEscalations.ts /
 * lib/clientEscalations.ts) — SSR-safe (server and first client paint
 * both render DEFAULT_LOCALE, so there's no hydration mismatch) and
 * reactive across every component that calls useLocale().
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readStoredLocale, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale: writeLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
