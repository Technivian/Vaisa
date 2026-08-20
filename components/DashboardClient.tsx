"use client";

import { useSyncExternalStore } from "react";
import { getSimulatedMetrics } from "@/lib/escalation";
import {
  parseStoredEscalations,
  ESCALATIONS_STORAGE_KEY,
  ESCALATIONS_CHANGE_EVENT,
} from "@/lib/clientEscalations";
import KpiSection from "./dashboard/KpiSection";
import ContactReasonsPanel from "./dashboard/ContactReasonsPanel";
import AiHandlingPanel from "./dashboard/AiHandlingPanel";
import LanguagesPanel from "./dashboard/LanguagesPanel";
import CasesSection from "./dashboard/CasesSection";

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
 * Escalations live only in this browser's localStorage (see
 * lib/clientEscalations.ts) — there is no server-side store on Vercel.
 * useSyncExternalStore is React's built-in tool for reading external
 * mutable state like this safely: it returns the server snapshot ("no
 * escalations") for the initial/SSR render so hydration always matches,
 * then reads the real value once mounted in the browser. It also picks up
 * same-tab writes (e.g. changing a case's status) via a custom event,
 * since the native `storage` event only fires in other tabs.
 */
export default function DashboardClient() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const escalations = parseStoredEscalations(raw || null);
  const metrics = getSimulatedMetrics(escalations.length);

  return (
    <div className="space-y-5">
      <KpiSection metrics={metrics} />

      <ContactReasonsPanel />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AiHandlingPanel />
        <LanguagesPanel />
      </div>

      <CasesSection realEscalations={escalations} />
    </div>
  );
}
