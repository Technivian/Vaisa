import type { Escalation } from "./escalation";

export const ESCALATIONS_STORAGE_KEY = "vaisa_escalations";

function isValidEscalation(value: unknown): value is Escalation {
  if (!value || typeof value !== "object") return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    typeof e.timestamp === "string" &&
    typeof e.reason === "string" &&
    typeof e.customerLanguage === "string" &&
    typeof e.summary === "string" &&
    (e.urgency === "low" || e.urgency === "medium" || e.urgency === "high") &&
    typeof e.recommendedAction === "string" &&
    Array.isArray(e.transcript) &&
    e.status === "open"
  );
}

/** Parses raw localStorage content defensively. Malformed JSON, a
 * non-array value, or entries missing required fields are all treated as
 * "nothing stored" rather than throwing — a corrupted or hand-edited
 * localStorage value must never break the dashboard. Pure — no I/O, so
 * it's trivially testable without a DOM. */
export function parseStoredEscalations(raw: string | null): Escalation[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEscalation);
  } catch {
    return [];
  }
}

/** Prepends a new escalation (newest first). If an escalation with the
 * same id is already present, the list is returned unchanged — no
 * duplicates. Pure — no I/O. */
export function addEscalation(existing: Escalation[], next: Escalation): Escalation[] {
  if (existing.some((e) => e.id === next.id)) return existing;
  return [next, ...existing];
}

/** Reads the escalation list from localStorage. Returns [] during SSR
 * (no `window`) and on any storage/parsing failure — this must never
 * throw, since it runs on every dashboard load. */
export function loadStoredEscalations(): Escalation[] {
  if (typeof window === "undefined") return [];
  try {
    return parseStoredEscalations(window.localStorage.getItem(ESCALATIONS_STORAGE_KEY));
  } catch {
    return [];
  }
}

/** Saves a newly created escalation to localStorage (deduped, newest
 * first) and returns the updated list. No-ops during SSR. Never stores
 * API keys or provider secrets — only the structured escalation record
 * returned by /api/chat. */
export function saveEscalation(escalation: Escalation): Escalation[] {
  const updated = addEscalation(loadStoredEscalations(), escalation);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ESCALATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable or full — the demo continues, just without
      // persistence for this escalation.
    }
  }
  return updated;
}

/** Clears all stored escalations (used by Reset Demo). No-ops during SSR. */
export function clearStoredEscalations(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ESCALATIONS_STORAGE_KEY);
  } catch {
    // ignore
  }
}
