"use client";

import { useSyncExternalStore } from "react";
import { getSimulatedMetrics } from "@/lib/escalation";
import { parseStoredEscalations, ESCALATIONS_STORAGE_KEY } from "@/lib/clientEscalations";
import DashboardMetrics from "./DashboardMetrics";
import ConversationPanel from "./ConversationPanel";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string {
  return window.localStorage.getItem(ESCALATIONS_STORAGE_KEY) ?? "";
}

function getServerSnapshot(): string {
  return "";
}

/**
 * Escalations live only in this browser's localStorage (see
 * lib/clientEscalations.ts) — there is no server-side store on Vercel.
 * useSyncExternalStore is React's built-in tool for reading external
 * mutable state like this safely: it returns the server snapshot ("no
 * escalations") for the initial/SSR render so hydration always matches,
 * then reads the real value once mounted in the browser.
 */
export default function DashboardClient() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const escalations = parseStoredEscalations(raw || null);
  const metrics = getSimulatedMetrics(escalations.length);

  return (
    <>
      <DashboardMetrics metrics={metrics} />
      <ConversationPanel escalations={escalations} />
    </>
  );
}
