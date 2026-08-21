"use client";

import { useSyncExternalStore } from "react";
import {
  parseStoredEscalations,
  ESCALATIONS_STORAGE_KEY,
  ESCALATIONS_CHANGE_EVENT,
} from "./clientEscalations";
import type { Escalation } from "./escalation";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(ESCALATIONS_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(ESCALATIONS_CHANGE_EVENT, callback);
  };
}

function getSnapshot(): string {
  return window.localStorage.getItem(ESCALATIONS_STORAGE_KEY) ?? "";
}

function getServerSnapshot(): string {
  return "";
}

/**
 * Reads the browser-persisted real escalations (see lib/clientEscalations.ts)
 * safely across server and client render. Any dashboard route that needs
 * real escalation data (Overview's recent-conversations list, the
 * Conversations page) calls this directly rather than threading it down
 * through the layout — useSyncExternalStore is cheap and this keeps each
 * page independent.
 */
export function useRealEscalations(): Escalation[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return parseStoredEscalations(raw || null);
}
