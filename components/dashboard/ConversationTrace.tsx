"use client";

import type { TraceStep } from "@/lib/conversationData";
import { getKnowledgeLabel } from "@/lib/knowledgeLabels";
import { useLocale } from "@/lib/i18n/LocaleContext";

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
  const { t } = useLocale();

  return (
    <div>
      {isSample && (
        <p className="mb-2 text-right text-[10px] text-ink-faint">{t.conversations.detail.illustrativeTrace}</p>
      )}
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2.5 text-xs">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success-soft text-[10px] font-bold text-success">
              ✓
            </span>
            <div>
              <p className="font-medium text-ink">{step.label}</p>
              <p className="text-ink-faint">
                {step.label === "Knowledge searched" ? getKnowledgeLabel(step.detail) : step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
