"use client";

import { useState } from "react";
import { useRealEscalations } from "@/lib/useRealEscalations";
import { selectConversationRecords } from "@/lib/conversationData";
import { getKpisForPeriod, KPI_TRENDS, PERIOD_OPTIONS, type Period } from "@/lib/periodMetrics";
import SectionHeader from "./shell/SectionHeader";
import MetricCard from "@/components/ui/MetricCard";
import TrendBadge from "@/components/ui/TrendBadge";
import PerformanceTrendPanel from "./PerformanceTrendPanel";
import TopTopicsPanel from "./TopTopicsPanel";
import AgentOutcomesPanel from "./AgentOutcomesPanel";
import RecentConversationsPanel from "./RecentConversationsPanel";
import { ChevronDownIcon } from "@/components/ui/icons";

export default function OverviewClient() {
  const [period, setPeriod] = useState<Period>("today");
  const realEscalations = useRealEscalations();
  const kpis = getKpisForPeriod(period, realEscalations.length);
  const records = selectConversationRecords(realEscalations);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Overview"
        description="VAISA customer-service performance and activity."
        action={
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                aria-label="Time period"
                className="appearance-none rounded-lg border border-border bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-ink outline-none transition-colors focus:border-brand"
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <span className="h-2 w-2 rounded-full bg-success" />
              Agent online
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Conversations"
          value={String(kpis.conversations)}
          supportingText="vs previous period"
          accent="info"
          trend={<TrendBadge value={KPI_TRENDS.conversations} sentiment="positive" />}
        />
        <MetricCard
          label="AI resolution"
          value={`${kpis.aiResolutionRate}%`}
          supportingText="vs previous period"
          accent="success"
          trend={<TrendBadge value={KPI_TRENDS.aiResolutionRate} sentiment="positive" />}
        />
        <MetricCard
          label="Human escalations"
          value={String(kpis.escalated)}
          supportingText="vs previous period"
          accent="warning"
          trend={<TrendBadge value={KPI_TRENDS.escalated} sentiment="positive" />}
        />
        <MetricCard
          label="First response"
          value={`${kpis.avgResponseTimeSeconds.toFixed(1)}s`}
          supportingText="AI first response"
          accent="brand"
        />
      </div>

      <PerformanceTrendPanel />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TopTopicsPanel />
        <AgentOutcomesPanel />
      </div>

      <RecentConversationsPanel records={records} />
    </div>
  );
}
