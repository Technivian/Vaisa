import type { DemoMetrics } from "@/lib/escalation";

export default function DashboardMetrics({ metrics }: { metrics: DemoMetrics }) {
  const cards = [
    { label: "Conversations today", value: metrics.conversationsToday.toString() },
    { label: "Resolved by AI", value: metrics.resolvedByAI.toString() },
    { label: "Escalated", value: metrics.escalated.toString() },
    { label: "Automation rate", value: `${metrics.automationRate}%` },
    { label: "Avg. AI response time", value: `${metrics.avgResponseTimeSeconds.toFixed(1)}s` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-white px-4 py-3.5"
        >
          <p className="text-2xl font-bold text-ink">{card.value}</p>
          <p className="mt-0.5 text-xs text-ink/50">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
