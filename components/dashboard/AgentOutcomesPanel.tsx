import { AI_HANDLING } from "@/lib/dashboardData";
import SectionPanel from "@/components/ui/SectionPanel";
import { ACCENT_CLASSES } from "@/components/ui/accent";

/** Compact segmented bar showing how VAISA splits work with the human
 * team. Renamed from the earlier "AI handling" panel per the
 * productization pass; same data, tighter layout, explanation always
 * visible (it's a single short sentence now, not worth toggling). */
export default function AgentOutcomesPanel() {
  const success = ACCENT_CLASSES.success;
  const warning = ACCENT_CLASSES.warning;

  return (
    <SectionPanel title="Agent outcomes" description="How VAISA handles customer contacts">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        <div
          className={success.dot}
          style={{ width: `${AI_HANDLING.resolvedPercentage}%` }}
          title={`Resolved automatically — ${AI_HANDLING.resolvedPercentage}%`}
        />
        <div
          className={warning.dot}
          style={{ width: `${AI_HANDLING.escalatedPercentage}%` }}
          title={`Human escalation — ${AI_HANDLING.escalatedPercentage}%`}
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
          Human escalation
          <span className="tabular-nums text-ink">{AI_HANDLING.escalatedPercentage}%</span>
        </span>
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-ink-faint">{AI_HANDLING.explanation}</p>
    </SectionPanel>
  );
}
