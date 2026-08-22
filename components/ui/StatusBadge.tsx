import type { Urgency } from "@/lib/escalation";
import type { ConversationStatus } from "@/lib/conversationData";
import { ACCENT_CLASSES, type Accent } from "./accent";

export const PRIORITY_LABEL: Record<Urgency, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

function Badge({ accent, label }: { accent: Accent; label: string }) {
  const styles = ACCENT_CLASSES[accent];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${styles.bg} ${styles.text} ${styles.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

const OUTCOME_ACCENT: Record<"resolved" | "escalated", Accent> = {
  resolved: "success",
  escalated: "warning",
};

const OUTCOME_LABEL: Record<"resolved" | "escalated", string> = {
  resolved: "Resolved",
  escalated: "Escalated",
};

export function OutcomeBadge({ outcome }: { outcome: "resolved" | "escalated" }) {
  return <Badge accent={OUTCOME_ACCENT[outcome]} label={OUTCOME_LABEL[outcome]} />;
}

/** The three-tier status a customer-service employee scans for: resolved
 * (green, nothing to do), escalated (amber, needs review), urgent (red,
 * needs attention now). Red is reserved for high-urgency escalations only
 * — deliberately rare, not a general-purpose "escalated" color. */
const CONVERSATION_STATUS_ACCENT: Record<ConversationStatus, Accent> = {
  resolved: "success",
  escalated: "warning",
  urgent: "danger",
};

const CONVERSATION_STATUS_LABEL: Record<ConversationStatus, string> = {
  resolved: "Resolved",
  escalated: "Escalated",
  urgent: "Needs attention",
};

export function ConversationStatusBadge({ status }: { status: ConversationStatus }) {
  return <Badge accent={CONVERSATION_STATUS_ACCENT[status]} label={CONVERSATION_STATUS_LABEL[status]} />;
}

export function SampleBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-subtle px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
      Sample
    </span>
  );
}
