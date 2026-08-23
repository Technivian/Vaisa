import { describe, it, expect } from "vitest";
import { translations } from "@/lib/i18n/translations";
import { format } from "@/lib/i18n/format";

/** Recursively collects every string value's "path" (e.g. "shell.nav.overview")
 * from a nested translation object, so both locales can be compared key
 * for key without hand-maintaining a list. */
function collectPaths(obj: unknown, prefix = ""): string[] {
  if (typeof obj === "string") return [prefix];
  if (Array.isArray(obj)) return [prefix];
  if (obj && typeof obj === "object") {
    return Object.entries(obj).flatMap(([key, value]) => collectPaths(value, prefix ? `${prefix}.${key}` : key));
  }
  return [];
}

describe("translations", () => {
  it("nl and en expose exactly the same set of keys", () => {
    const enPaths = collectPaths(translations.en).sort();
    const nlPaths = collectPaths(translations.nl).sort();
    expect(nlPaths).toEqual(enPaths);
  });

  it("every string is non-empty in both locales", () => {
    for (const locale of ["en", "nl"] as const) {
      const dict = translations[locale];
      for (const path of collectPaths(dict)) {
        const value = path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)[key], dict);
        if (typeof value === "string") {
          expect(value.length, `${locale}.${path} should not be empty`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("templates with placeholders exist with the same placeholder names in both locales", () => {
    const placeholderRegex = /\{(\w+)\}/g;
    function placeholdersIn(str: string): string[] {
      return Array.from(str.matchAll(placeholderRegex))
        .map((m) => m[1])
        .sort();
    }

    for (const path of collectPaths(translations.en)) {
      const enValue = path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)[key], translations.en);
      const nlValue = path.split(".").reduce<unknown>((acc, key) => (acc as Record<string, unknown>)[key], translations.nl);
      if (typeof enValue === "string" && typeof nlValue === "string") {
        expect(placeholdersIn(nlValue), `placeholders in nl.${path}`).toEqual(placeholdersIn(enValue));
      }
    }
  });
});

describe("format", () => {
  it("substitutes a single placeholder", () => {
    expect(format("Hello {name}", { name: "VAISA" })).toBe("Hello VAISA");
  });

  it("substitutes the same placeholder repeated multiple times", () => {
    expect(format("{n}/{n} passed", { n: 6 })).toBe("6/6 passed");
  });

  it("leaves an unmatched placeholder untouched", () => {
    expect(format("Hello {name}", {})).toBe("Hello {name}");
  });
});
