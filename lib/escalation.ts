import crypto from "crypto";

export type Urgency = "low" | "medium" | "high";

/** Open: not yet looked at. Review: a colleague is assessing it. Resolved:
 * closed out. This is purely a browser-persisted demo affordance (see
 * lib/clientEscalations.ts `updateEscalationStatus`) — there is no backend
 * workflow behind it. */
export type EscalationStatus = "open" | "review" | "resolved";

export interface TranscriptTurn {
  role: "customer" | "assistant";
  content: string;
}

export interface Escalation {
  id: string;
  timestamp: string;
  reason: string;
  customerLanguage: string;
  summary: string;
  urgency: Urgency;
  recommendedAction: string;
  transcript: TranscriptTurn[];
  status: EscalationStatus;
}

export interface EscalationInput {
  reason: string;
  customerLanguage: string;
  summary: string;
  urgency: Urgency;
  recommendedAction: string;
  transcript: TranscriptTurn[];
}

/**
 * Builds a structured escalation record. This is a pure, server-side
 * construction step only — it does NOT persist anything server-side.
 * Vercel's serverless functions have no durable or shared filesystem
 * across invocations, so this demo persists escalations in the browser
 * instead (see lib/clientEscalations.ts). The caller (lib/tools.ts) is
 * responsible for returning this object up to the client, which saves it
 * to localStorage.
 */
export function createEscalation(input: EscalationInput): Escalation {
  return {
    id: `ESC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    reason: input.reason,
    customerLanguage: input.customerLanguage,
    summary: input.summary,
    urgency: input.urgency,
    recommendedAction: input.recommendedAction,
    transcript: input.transcript,
    status: "open",
  };
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

/**
 * Simulated KPI numbers for the demo dashboard. `liveEscalationCount` is
 * the number of escalations currently in this browser's localStorage, so
 * the metrics move visibly when a presenter triggers a handoff, while
 * staying clearly labelled as simulated. Pure function — the dashboard
 * computes this identically on the server (count 0, for the initial
 * render) and on the client (after localStorage is read), so there is no
 * hydration mismatch.
 */
export function getSimulatedMetrics(liveEscalationCount: number): DemoMetrics {
  const escalated = BASELINE_ESCALATED + liveEscalationCount;
  const conversationsToday = BASELINE_CONVERSATIONS + liveEscalationCount;
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
