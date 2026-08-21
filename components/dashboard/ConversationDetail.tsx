"use client";

import type { EscalationStatus } from "@/lib/escalation";
import type { ConversationRecord } from "@/lib/conversationData";
import { getAiAssessmentForRecord } from "@/lib/conversationData";
import { getLanguageCode, getShortText } from "@/lib/dashboardData";
import { PriorityBadge, CaseStatusBadge, OutcomeBadge, SampleBadge, PRIORITY_ACCENT } from "@/components/ui/StatusBadge";
import { ACCENT_CLASSES } from "@/components/ui/accent";
import Disclosure from "@/components/ui/Disclosure";
import ConversationTrace from "./ConversationTrace";
import KnowledgeUsedList from "./KnowledgeUsedList";

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

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`;
}

export default function ConversationDetail({
  record,
  onStatusChange,
}: {
  record: ConversationRecord;
  onStatusChange?: (status: EscalationStatus) => void;
}) {
  const isEscalated = record.outcome === "escalated";
  const actionAccent = record.urgency ? ACCENT_CLASSES[PRIORITY_ACCENT[record.urgency]] : ACCENT_CLASSES.ink;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Conversation</h2>
        {record.isSample && <SampleBadge />}
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <OutcomeBadge outcome={record.outcome} />
          {record.urgency && <PriorityBadge urgency={record.urgency} />}
          <Chip>{record.topic}</Chip>
          <Chip>{getLanguageCode(record.language)}</Chip>
          {isEscalated &&
            (record.isSample ? (
              <CaseStatusBadge status={record.status ?? "open"} />
            ) : (
              <select
                value={record.status}
                onChange={(e) => onStatusChange?.(e.target.value as EscalationStatus)}
                className="rounded-full border border-border bg-white px-2 py-0.5 text-[11px] font-semibold text-ink outline-none transition-colors focus:border-brand"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Block label="Conversation ID">
            <span className="font-mono text-xs">{record.id}</span>
          </Block>
          <Block label="Intent">{record.topic}</Block>
          <Block label="Duration">{formatDuration(record.durationSeconds)}</Block>
        </div>

        {isEscalated && record.summary && (
          <>
            <Block label="Customer issue">{getShortText(record.summary)}</Block>
            <Block label="VAISA assessment">{getAiAssessmentForRecord(record)}</Block>
            {record.recommendedAction && (
              <div className={`rounded-lg border-l-[3px] ${actionAccent.border} ${actionAccent.bg} px-3.5 py-3`}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                  Recommended action
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-ink">
                  {getShortText(record.recommendedAction)}
                </p>
              </div>
            )}
          </>
        )}

        <ConversationTrace steps={record.trace} isSample={record.isSample} />

        <KnowledgeUsedList items={record.knowledgeUsed} />

        <Disclosure labelClosed="View transcript" labelOpen="Hide transcript">
          <div className="space-y-2 rounded-lg border border-border bg-surface-subtle p-3">
            {record.transcript.length === 0 && (
              <p className="text-xs text-ink-faint">No transcript captured.</p>
            )}
            {record.transcript.map((turn, i) => (
              <div key={i} className="text-xs leading-relaxed">
                <span className={`font-semibold ${turn.role === "customer" ? "text-ink" : "text-brand-dark"}`}>
                  {turn.role === "customer" ? "Customer" : "VAISA"}:
                </span>{" "}
                <span className="text-ink-soft">{turn.content}</span>
              </div>
            ))}
          </div>
        </Disclosure>

        <p className="border-t border-border pt-3 font-mono text-[11px] text-ink-faint">
          {record.id} · {formatTimestamp(record.timestamp)}
        </p>
      </div>
    </div>
  );
}
