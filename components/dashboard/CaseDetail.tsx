"use client";

import type { EscalationStatus } from "@/lib/escalation";
import { formatCategory, getAiAssessment, getShortText, type DisplayCase } from "@/lib/dashboardData";
import { PriorityBadge, CaseStatusBadge, SampleBadge, PRIORITY_ACCENT } from "@/components/ui/StatusBadge";
import { ACCENT_CLASSES } from "@/components/ui/accent";

const STATUS_OPTIONS: { value: EscalationStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "review", label: "Review" },
  { value: "resolved", label: "Resolved" },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-ink-soft">
      {children}
    </span>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="mt-1 text-sm leading-snug text-ink">{children}</p>
    </div>
  );
}

function Disclosure({
  labelClosed,
  labelOpen,
  children,
}: {
  labelClosed: string;
  labelOpen: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors duration-150 hover:border-brand hover:text-brand-dark [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{labelClosed}</span>
        <span className="hidden group-open:inline">{labelOpen}</span>
        <span className="text-ink-faint transition-transform duration-150 group-open:rotate-180">
          ⌄
        </span>
      </summary>
      <div className="mt-2">{children}</div>
    </details>
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
  const assistantTurns = item.transcript.filter((t) => t.role === "assistant").length;
  const actionAccent = ACCENT_CLASSES[PRIORITY_ACCENT[item.urgency]];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          VAISA Handoff
        </h2>
        {item.isSample && <SampleBadge />}
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <PriorityBadge urgency={item.urgency} />
          <Chip>{formatCategory(item.reason)}</Chip>
          <Chip>{item.customerLanguage}</Chip>
          {item.isSample ? (
            <CaseStatusBadge status={item.status} />
          ) : (
            <select
              value={item.status}
              onChange={(e) => onStatusChange?.(e.target.value as EscalationStatus)}
              className="rounded-full border border-border bg-white px-2 py-0.5 text-[11px] font-semibold text-ink outline-none transition-colors focus:border-brand"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <Block label="Customer issue">{getShortText(item.summary)}</Block>

        <Block label="AI assessment">{getAiAssessment(item.reason)}</Block>

        <div className={`rounded-lg border-l-[3px] ${actionAccent.border} ${actionAccent.bg} px-3.5 py-3`}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Recommended action
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-ink">
            {getShortText(item.recommendedAction)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Disclosure labelClosed="View troubleshooting" labelOpen="Hide troubleshooting">
            <p className="rounded-lg bg-surface-subtle px-3 py-2 text-xs leading-relaxed text-ink-soft">
              {assistantTurns > 0
                ? `${assistantTurns} exchange${assistantTurns === 1 ? "" : "s"} with VAISA before this case was escalated.`
                : "Escalated on the first message — no prior troubleshooting."}
            </p>
          </Disclosure>

          <Disclosure labelClosed="View transcript" labelOpen="Hide transcript">
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
          </Disclosure>
        </div>

        <p className="border-t border-border pt-3 font-mono text-[11px] text-ink-faint">
          {item.id} · {formatTimestamp(item.timestamp)}
        </p>
      </div>
    </div>
  );
}
