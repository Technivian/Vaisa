"use client";

import { useState } from "react";
import { CONTACT_REASONS } from "@/lib/dashboardData";
import SectionPanel from "@/components/ui/SectionPanel";
import ProgressBar from "@/components/ui/ProgressBar";
import InsightRow from "@/components/ui/InsightRow";

/** Compact version of the contact-reasons breakdown for Overview — tight
 * rows, no tall empty card. */
export default function TopTopicsPanel() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = CONTACT_REASONS.find((r) => r.id === selectedId) ?? null;

  return (
    <SectionPanel title="Top topics" description="Simulated distribution of today's conversations">
      <div className="space-y-0.5">
        {CONTACT_REASONS.map((reason) => (
          <ProgressBar
            key={reason.id}
            label={reason.label}
            percentage={reason.percentage}
            accent={reason.accent}
            selected={selectedId === reason.id}
            onClick={() => setSelectedId((prev) => (prev === reason.id ? null : reason.id))}
          />
        ))}
      </div>
      {selected && (
        <div className="mt-2.5">
          <InsightRow accent={selected.accent}>
            <span className="font-semibold text-ink">{selected.label}</span>
            <span className="text-ink-faint">
              {" "}
              — {selected.conversations} conversations · {selected.aiResolutionRate}% AI resolution
            </span>
            <br />
            <span className="text-ink-faint">Top intents: </span>
            <span>{selected.topIntents.join(" · ")}</span>
          </InsightRow>
        </div>
      )}
    </SectionPanel>
  );
}
