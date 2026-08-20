"use client";

import { useState } from "react";
import { AI_HANDLING } from "@/lib/dashboardData";
import SectionPanel from "@/components/ui/SectionPanel";
import InsightRow from "@/components/ui/InsightRow";
import { ACCENT_CLASSES } from "@/components/ui/accent";

export default function AiHandlingPanel() {
  const [showExplanation, setShowExplanation] = useState(true);
  const success = ACCENT_CLASSES.success;
  const warning = ACCENT_CLASSES.warning;

  return (
    <SectionPanel title="AI handling" description="How VAISA handles customer contacts">
      <button
        type="button"
        onClick={() => setShowExplanation((v) => !v)}
        aria-expanded={showExplanation}
        className="block w-full text-left"
      >
        <div className="flex h-2.5 w-full overflow-hidden rounded-full">
          <div
            className={success.dot}
            style={{ width: `${AI_HANDLING.resolvedPercentage}%` }}
            title={`Resolved automatically — ${AI_HANDLING.resolvedPercentage}%`}
          />
          <div
            className={warning.dot}
            style={{ width: `${AI_HANDLING.escalatedPercentage}%` }}
            title={`Escalated — ${AI_HANDLING.escalatedPercentage}%`}
          />
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
            <span className={`h-2 w-2 rounded-full ${success.dot}`} />
            Resolved automatically
            <span className="tabular-nums text-ink">{AI_HANDLING.resolvedPercentage}%</span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
            <span className={`h-2 w-2 rounded-full ${warning.dot}`} />
            Escalated
            <span className="tabular-nums text-ink">{AI_HANDLING.escalatedPercentage}%</span>
          </span>
        </div>
      </button>

      {showExplanation && (
        <div className="mt-3">
          <InsightRow accent="ink">{AI_HANDLING.explanation}</InsightRow>
        </div>
      )}
    </SectionPanel>
  );
}
