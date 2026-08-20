import type { Urgency, EscalationStatus } from "@/lib/escalation";
import { ACCENT_CLASSES, type Accent } from "./accent";

const PRIORITY_ACCENT: Record<Urgency, Accent> = {
  high: "danger",
  medium: "warning",
  low: "info",
};

const PRIORITY_LABEL: Record<Urgency, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const STATUS_ACCENT: Record<EscalationStatus, Accent> = {
  open: "warning",
  review: "info",
  resolved: "success",
};

const STATUS_LABEL: Record<EscalationStatus, string> = {
  open: "Open",
  review: "Review",
  resolved: "Resolved",
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

export function PriorityBadge({ urgency }: { urgency: Urgency }) {
  return <Badge accent={PRIORITY_ACCENT[urgency]} label={PRIORITY_LABEL[urgency]} />;
}

export function CaseStatusBadge({ status }: { status: EscalationStatus }) {
  return <Badge accent={STATUS_ACCENT[status]} label={STATUS_LABEL[status]} />;
}

export function SampleBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-subtle px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
      Sample
    </span>
  );
}
