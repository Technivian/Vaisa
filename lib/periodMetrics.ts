import { getSimulatedMetrics } from "./escalation";

export type Period = "today" | "7d" | "30d";

export const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export interface PeriodKpis {
  conversations: number;
  resolvedByAI: number;
  aiResolutionRate: number;
  escalated: number;
  avgResponseTimeSeconds: number;
}

/** Simulated baselines for the longer windows. "Today" instead reuses the
 * existing getSimulatedMetrics (lib/escalation.ts), which already blends
 * in real browser-persisted escalations — the period selector doesn't
 * change that behavior, it just adds two more illustrative windows around
 * it. All numbers here are demo data. */
const PERIOD_BASELINES: Record<"7d" | "30d", PeriodKpis> = {
  "7d": {
    conversations: 312,
    resolvedByAI: 222,
    aiResolutionRate: 71,
    escalated: 89,
    avgResponseTimeSeconds: 2.3,
  },
  "30d": {
    conversations: 1284,
    resolvedByAI: 899,
    aiResolutionRate: 70,
    escalated: 361,
    avgResponseTimeSeconds: 2.4,
  },
};

/** Fixed, illustrative trend deltas for the four KPI cards. Kept constant
 * across periods for simplicity — still fully deterministic/simulated,
 * just not a full period x trend matrix. */
export const KPI_TRENDS = {
  conversations: 12,
  aiResolutionRate: 4,
  escalated: -8,
} as const;

export function getKpisForPeriod(period: Period, liveEscalationCount: number): PeriodKpis {
  if (period === "today") {
    const m = getSimulatedMetrics(liveEscalationCount);
    return {
      conversations: m.conversationsToday,
      resolvedByAI: m.resolvedByAI,
      aiResolutionRate: m.automationRate,
      escalated: m.escalated,
      avgResponseTimeSeconds: m.avgResponseTimeSeconds,
    };
  }
  return PERIOD_BASELINES[period];
}
