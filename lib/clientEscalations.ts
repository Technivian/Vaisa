import type { Escalation, EscalationStatus } from "./escalation";

export const ESCALATIONS_STORAGE_KEY = "vaisa_escalations";

/** The native `storage` event only fires in *other* tabs, never the tab
 * that made the write — so a same-tab UI (like the dashboard's status
 * dropdown updating its own list) needs its own signal. Every write below
 * dispatches this after updating localStorage; useSyncExternalStore
 * subscribers listen for both this and `storage`. */
export const ESCALATIONS_CHANGE_EVENT = "vaisa-escalations-changed";

function notifyChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ESCALATIONS_CHANGE_EVENT));
}

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
    (e.status === "open" || e.status === "review" || e.status === "resolved")
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
      notifyChange();
    } catch {
      // Storage unavailable or full — the demo continues, just without
      // persistence for this escalation.
    }
  }
  return updated;
}

/** Updates the status of one stored escalation by id (pure — no I/O).
 * Unknown ids are a no-op — the list is returned unchanged, which matters
 * for sample/demo-only cases that are never actually in localStorage. */
export function setEscalationStatus(
  existing: Escalation[],
  id: string,
  status: EscalationStatus
): Escalation[] {
  return existing.map((e) => (e.id === id ? { ...e, status } : e));
}

/** Updates and persists the status of one stored escalation. No-ops
 * during SSR. Used by the presenter-facing status control on real
 * (non-sample) cases only. */
export function updateEscalationStatus(id: string, status: EscalationStatus): Escalation[] {
  const updated = setEscalationStatus(loadStoredEscalations(), id, status);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(ESCALATIONS_STORAGE_KEY, JSON.stringify(updated));
      notifyChange();
    } catch {
      // Storage unavailable or full — the demo continues without
      // persisting this particular status change.
    }
  }
  return updated;
}

/** Clears all stored escalations (used by Reset Demo). No-ops during SSR. */
export function clearStoredEscalations(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ESCALATIONS_STORAGE_KEY);
    notifyChange();
  } catch {
    // ignore
  }
}
