import fs from "fs";
import path from "path";
import crypto from "crypto";

export type Urgency = "low" | "medium" | "high";

export interface TranscriptTurn {
  role: "customer" | "assistant";
  content: string;
}

export interface Escalation {
  id: string;
  timestamp: string;
  language: string;
  reason: string;
  summary: string;
  urgency: Urgency;
  recommendedAction: string;
  transcript: TranscriptTurn[];
  status: "open";
}

export interface EscalationInput {
  reason: string;
  customerLanguage: string;
  summary: string;
  urgency: Urgency;
  recommendedAction: string;
  transcript: TranscriptTurn[];
}

const ESCALATIONS_PATH = path.join(process.cwd(), "data", "escalations.json");

// Module-level store so the dashboard and chat route (same Next.js server
// process in dev / on Replit) see escalations immediately. Best-effort
// persistence to disk is layered on top, but the in-memory array is the
// source of truth for the running process, avoiding read-only filesystem
// crashes in constrained hosting environments.
let store: Escalation[] | null = null;

function loadStore(): Escalation[] {
  if (store) return store;
  try {
    const raw = fs.readFileSync(ESCALATIONS_PATH, "utf-8");
    store = JSON.parse(raw) as Escalation[];
  } catch {
    store = [];
  }
  return store;
}

function persist(): void {
  try {
    fs.writeFileSync(ESCALATIONS_PATH, JSON.stringify(store, null, 2));
  } catch {
    // Read-only filesystem (e.g. some serverless hosts) — the in-memory
    // store still works for the lifetime of this process, which is all a
    // demo needs.
  }
}

export function createEscalation(input: EscalationInput): Escalation {
  const escalations = loadStore();
  const escalation: Escalation = {
    id: `ESC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    language: input.customerLanguage,
    reason: input.reason,
    summary: input.summary,
    urgency: input.urgency,
    recommendedAction: input.recommendedAction,
    transcript: input.transcript,
    status: "open",
  };
  escalations.unshift(escalation);
  persist();
  return escalation;
}

export function getEscalations(): Escalation[] {
  return loadStore();
}

export function resetEscalations(): void {
  store = [];
  persist();
}

export interface DemoMetrics {
  conversationsToday: number;
  resolvedByAI: number;
  escalated: number;
  automationRate: number;
  avgResponseTimeSeconds: number;
}

const BASELINE_CONVERSATIONS = 47;
const BASELINE_RESOLVED = 34;
const BASELINE_ESCALATED = 13;

/** Simulated KPI numbers for the demo dashboard. Real escalations created
 * during the current demo session are layered on top of a fixed baseline
 * so the metrics move visibly when a presenter triggers a handoff, while
 * staying clearly labelled as simulated. */
export function getSimulatedMetrics(): DemoMetrics {
  const liveEscalations = getEscalations().length;
  const escalated = BASELINE_ESCALATED + liveEscalations;
  const conversationsToday = BASELINE_CONVERSATIONS + liveEscalations;
  const resolvedByAI = BASELINE_RESOLVED;
  const automationRate = Math.round((resolvedByAI / conversationsToday) * 100);

  return {
    conversationsToday,
    resolvedByAI,
    escalated,
    automationRate,
    avgResponseTimeSeconds: 2.1,
  };
}
