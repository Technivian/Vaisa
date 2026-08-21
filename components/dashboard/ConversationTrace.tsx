import type { TraceStep } from "@/lib/conversationData";

/**
 * Renders VAISA's observable activity for a conversation — intent
 * classification, knowledge lookups, tool calls, escalation decisions,
 * outcome. This is a demo trace, not the model's internal reasoning: it
 * only ever names things this app can actually observe. Never renders
 * hidden chain-of-thought.
 */
export default function ConversationTrace({
  steps,
  isSample,
}: {
  steps: TraceStep[];
  isSample: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">VAISA activity</p>
        {isSample && <span className="text-[10px] text-ink-faint">Illustrative demo trace</span>}
      </div>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success-soft text-[10px] font-bold text-success">
              ✓
            </span>
            <div>
              <p className="font-medium text-ink">{step.label}</p>
              <p className="text-ink-faint">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
