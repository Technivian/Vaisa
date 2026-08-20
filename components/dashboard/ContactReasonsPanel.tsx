"use client";

import { useState } from "react";
import { CONTACT_REASONS } from "@/lib/dashboardData";
import SectionPanel from "@/components/ui/SectionPanel";
import ProgressBar from "@/components/ui/ProgressBar";
import InsightRow from "@/components/ui/InsightRow";

export default function ContactReasonsPanel() {
  const [selectedId, setSelectedId] = useState(CONTACT_REASONS[0].id);
  const selected = CONTACT_REASONS.find((r) => r.id === selectedId) ?? CONTACT_REASONS[0];

  return (
    <SectionPanel
      title="Contact reasons"
      description="Simulated distribution of today's conversations"
    >
      <div className="space-y-1">
        {CONTACT_REASONS.map((reason) => (
          <ProgressBar
            key={reason.id}
            label={reason.label}
            percentage={reason.percentage}
            accent={reason.accent}
            selected={selectedId === reason.id}
            onClick={() => setSelectedId(reason.id)}
          />
        ))}
      </div>
      <div className="mt-3">
        <InsightRow accent={selected.accent}>
          <span className="font-semibold text-ink">{selected.label}</span>
          <span className="text-ink-faint"> — {selected.conversations} conversations, </span>
          <span className="font-medium">{selected.aiResolutionRate}% AI resolution</span>
          <br />
          <span>{selected.note}</span>
        </InsightRow>
      </div>
    </SectionPanel>
  );
}
