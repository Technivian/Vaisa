import type { Urgency, EscalationStatus } from "./escalation";
import { formatCategory, getLanguageCode, type DisplayCase } from "./dashboardData";

export type PriorityFilter = "all" | Urgency;
export type LanguageFilter = "all" | "NL" | "DE" | "FR" | "EN";
export type StatusFilter = "all" | EscalationStatus;

export interface CaseFilters {
  priority: PriorityFilter;
  language: LanguageFilter;
  status: StatusFilter;
  query: string;
}

export const DEFAULT_CASE_FILTERS: CaseFilters = {
  priority: "all",
  language: "all",
  status: "all",
  query: "",
};

const KNOWN_LANGUAGE_FILTERS = new Set<LanguageFilter>(["NL", "DE", "FR", "EN"]);

/** Only matches a specific filter if the case's language maps to one of
 * the four known codes — an unrecognized language never matches a
 * specific filter (only "all"), which is the safe default. */
function languageCodeFor(customerLanguage: string): LanguageFilter | null {
  const code = getLanguageCode(customerLanguage);
  return KNOWN_LANGUAGE_FILTERS.has(code as LanguageFilter) ? (code as LanguageFilter) : null;
}

/** Pure client-side filter + search over the case list — no API/database
 * involved, matching the demo scope. Applies priority, language, and
 * status filters (each an exact match unless "all"), then a free-text
 * search across id, reason, category, summary, and language. */
export function filterCases(cases: DisplayCase[], filters: CaseFilters): DisplayCase[] {
  const query = filters.query.trim().toLowerCase();

  return cases.filter((c) => {
    if (filters.priority !== "all" && c.urgency !== filters.priority) return false;
    if (filters.status !== "all" && c.status !== filters.status) return false;
    if (filters.language !== "all" && languageCodeFor(c.customerLanguage) !== filters.language) {
      return false;
    }

    if (query) {
      const haystack = [c.id, c.reason, formatCategory(c.reason), c.summary, c.customerLanguage]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}
