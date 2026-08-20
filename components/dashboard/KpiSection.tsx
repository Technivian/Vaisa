"use client";

import { useState } from "react";
import type { DemoMetrics } from "@/lib/escalation";
import MetricCard from "@/components/ui/MetricCard";
import InsightRow from "@/components/ui/InsightRow";
import type { Accent } from "@/components/ui/accent";

type KpiId = "conversations" | "resolved" | "escalated" | "automation" | "response";

function buildKpis(metrics: DemoMetrics): {
  id: KpiId;
  label: string;
  value: string;
  supportingText: string;
  accent: Accent;
  insight: string;
}[] {
  return [
    {
      id: "conversations",
      label: "Conversations",
      value: String(metrics.conversationsToday),
      supportingText: "Today's conversations",
      accent: "info",
      insight: `${metrics.conversationsToday} simulated conversations were handled by VAISA today.`,
    },
    {
      id: "resolved",
      label: "AI resolved",
      value: String(metrics.resolvedByAI),
      supportingText: "Resolved without human intervention",
      accent: "success",
      insight: `VAISA resolved ${metrics.resolvedByAI} of ${metrics.conversationsToday} simulated conversations without human intervention.`,
    },
    {
      id: "escalated",
      label: "Escalated",
      value: String(metrics.escalated),
      supportingText: "Sent to customer service",
      accent: "warning",
      insight: `${metrics.escalated} simulated conversations required human review. Technical and warranty cases account for most escalations.`,
    },
    {
      id: "automation",
      label: "Automation rate",
      value: `${metrics.automationRate}%`,
      supportingText: `${metrics.resolvedByAI} of ${metrics.conversationsToday} conversations`,
      accent: "brand",
      insight: `Illustrative automation rate: ${metrics.automationRate}%. A real pilot would establish an actual baseline and target.`,
    },
    {
      id: "response",
      label: "Avg. response",
      value: `${metrics.avgResponseTimeSeconds.toFixed(1)}s`,
      supportingText: "AI first response",
      accent: "info",
      insight: `VAISA's simulated first response time is ${metrics.avgResponseTimeSeconds.toFixed(1)} seconds — illustrative, not a measured production benchmark.`,
    },
  ];
}

export default function KpiSection({ metrics }: { metrics: DemoMetrics }) {
  const kpis = buildKpis(metrics);
  const [selected, setSelected] = useState<KpiId>("automation");
  const active = kpis.find((k) => k.id === selected) ?? kpis[0];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <MetricCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            supportingText={kpi.supportingText}
            accent={kpi.accent}
            selected={selected === kpi.id}
            onClick={() => setSelected(kpi.id)}
          />
        ))}
      </div>
      <InsightRow accent={active.accent}>{active.insight}</InsightRow>
    </div>
  );
}
