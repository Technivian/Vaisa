"use client";

import type { EscalationStatus } from "@/lib/escalation";
import { formatCategory, type DisplayCase } from "@/lib/dashboardData";
import { PriorityBadge, SampleBadge } from "@/components/ui/StatusBadge";

const STATUS_OPTIONS: { value: EscalationStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "review", label: "Review" },
  { value: "resolved", label: "Resolved" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
      <div className="mt-1 text-sm text-ink">{children}</div>
    </div>
  );
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function CaseDetail({
  item,
  onStatusChange,
}: {
  item: DisplayCase;
  onStatusChange?: (status: EscalationStatus) => void;
}) {
  const firstCustomerTurn = item.transcript.find((t) => t.role === "customer")?.content;
  const assistantTurns = item.transcript.filter((t) => t.role === "assistant").length;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            VAISA Handoff
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-ink-faint">{item.id}</span>
            {item.isSample && <SampleBadge />}
          </p>
        </div>
        <PriorityBadge urgency={item.urgency} />
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Language">{item.customerLanguage}</Field>
          <Field label="Category">{formatCategory(item.reason)}</Field>
        </div>

        {firstCustomerTurn && <Field label="Customer issue">“{firstCustomerTurn}”</Field>}

        <Field label="VAISA summary">{item.summary}</Field>

        <Field label="Troubleshooting performed">
          {assistantTurns > 0
            ? `${assistantTurns} exchange${assistantTurns === 1 ? "" : "s"} with VAISA before this case was escalated — see the full transcript below.`
            : "Escalated on the first message — see the full transcript below."}
        </Field>

        <Field label="Recommended next action">{item.recommendedAction}</Field>

        <Field label="Status">
          {item.isSample ? (
            <span className="text-ink-faint">Sample case — status is illustrative only.</span>
          ) : (
            <select
              value={item.status}
              onChange={(e) => onStatusChange?.(e.target.value as EscalationStatus)}
              className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm font-medium text-ink outline-none transition-colors focus:border-brand"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Conversation transcript
          </p>
          <div className="space-y-2 rounded-lg border border-border bg-surface-subtle p-3">
            {item.transcript.length === 0 && (
              <p className="text-xs text-ink-faint">No transcript captured.</p>
            )}
            {item.transcript.map((turn, i) => (
              <div key={i} className="text-xs leading-relaxed">
                <span
                  className={`font-semibold ${turn.role === "customer" ? "text-ink" : "text-brand-dark"}`}
                >
                  {turn.role === "customer" ? "Customer" : "VAISA"}:
                </span>{" "}
                <span className="text-ink-soft">{turn.content}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
          <Field label="Case ID">
            <span className="font-mono">{item.id}</span>
          </Field>
          <Field label="Timestamp">{formatTimestamp(item.timestamp)}</Field>
        </div>
      </div>
    </div>
  );
}
