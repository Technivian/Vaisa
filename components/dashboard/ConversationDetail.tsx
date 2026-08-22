"use client";

import { useState } from "react";
import type { EscalationStatus } from "@/lib/escalation";
import type { ConversationRecord } from "@/lib/conversationData";
import { getConversationStatus } from "@/lib/conversationData";
import { ConversationStatusBadge, SampleBadge, PRIORITY_LABEL } from "@/components/ui/StatusBadge";
import { ACCENT_CLASSES } from "@/components/ui/accent";
import Disclosure from "@/components/ui/Disclosure";
import ConversationTrace from "./ConversationTrace";
import KnowledgeUsedList from "./KnowledgeUsedList";

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

function buildSubtitle(record: ConversationRecord): string {
  const parts = [record.topic, record.language];
  if (record.outcome === "resolved") {
    parts.push(formatDuration(record.durationSeconds));
  } else if (record.urgency) {
    parts.push(`${PRIORITY_LABEL[record.urgency]} priority`);
  }
  return parts.join(" · ");
}

/** Red is reserved for high-urgency safety-type cases; every other
 * escalation gets the calmer amber treatment, so the page doesn't read as
 * alarmed by default. */
function recommendedActionAccent(urgency: ConversationRecord["urgency"]) {
  return urgency === "high" ? ACCENT_CLASSES.danger : ACCENT_CLASSES.warning;
}

function Transcript({ record }: { record: ConversationRecord }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Conversation</p>
      {record.transcript.length === 0 ? (
        <p className="text-xs text-ink-faint">No transcript captured.</p>
      ) : (
        <div className="space-y-3">
          {record.transcript.map((turn, i) => (
            <div key={i}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                {turn.role === "customer" ? "Customer" : "VAISA"}
              </p>
              <p
                className={`mt-1 rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  turn.role === "customer"
                    ? "bg-ink text-white"
                    : "border border-border bg-surface-subtle text-ink"
                }`}
              >
                {turn.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ConversationDetail({
  record,
  onStatusChange,
}: {
  record: ConversationRecord;
  onStatusChange?: (status: EscalationStatus) => void;
}) {
  const isEscalated = record.outcome === "escalated";
  const status = getConversationStatus(record);
  const actionAccent = recommendedActionAccent(record.urgency);

  // Sample escalations have no localStorage record to persist a status
  // change to, so "Take case" moves them through a local, in-memory
  // status instead — resets to "open" whenever a different conversation
  // is selected, since the parent remounts this component via `key`.
  const [sampleStatus, setSampleStatus] = useState<EscalationStatus>(record.status ?? "open");
  const caseStatus = record.isSample ? sampleStatus : record.status;

  function handleTakeCase() {
    if (record.isSample) {
      setSampleStatus("review");
    } else {
      onStatusChange?.("review");
    }
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-border px-5 py-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-semibold text-ink">Conversation {record.id}</h2>
          <ConversationStatusBadge status={status} />
        </div>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-xs text-ink-faint">{buildSubtitle(record)}</p>
          {record.isSample && <SampleBadge />}
        </div>
      </div>

      <div className="space-y-5 px-5 py-4">
        {record.summary && <Block label="Summary">{record.summary}</Block>}

        {isEscalated ? (
          <>
            {record.recommendedAction && (
              <div className={`rounded-lg border-l-[3px] ${actionAccent.border} ${actionAccent.bg} px-3.5 py-3`}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                  Recommended action
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-ink">{record.recommendedAction}</p>
                <div className="mt-3">
                  {caseStatus === "open" ? (
                    <button
                      type="button"
                      onClick={handleTakeCase}
                      className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-ink/85"
                    >
                      Take case
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                      <span className="h-1.5 w-1.5 rounded-full bg-info" aria-hidden="true" />
                      {caseStatus === "resolved" ? "Resolved" : "In review"}
                    </span>
                  )}
                </div>
              </div>
            )}

            <Transcript record={record} />

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                VAISA handoff
              </p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-[11px] text-ink-faint">Priority</p>
                  <p className="font-medium text-ink">{record.urgency ? PRIORITY_LABEL[record.urgency] : "—"}</p>
                </div>
                <div>
                  <p className="text-[11px] text-ink-faint">Category</p>
                  <p className="font-medium text-ink">{record.topic}</p>
                </div>
                <div>
                  <p className="text-[11px] text-ink-faint">Language</p>
                  <p className="font-medium text-ink">{record.language}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Transcript record={record} />

            <div className="rounded-lg border-l-[3px] border-success/25 bg-success-soft px-3.5 py-3">
              <p className="text-sm font-semibold text-success">✓ Resolved by VAISA</p>
              <p className="mt-1 text-xs text-ink-soft">No employee action required.</p>
              {record.durationSeconds && (
                <p className="mt-2 text-[11px] text-ink-faint">
                  Resolution time: {formatDuration(record.durationSeconds)}
                </p>
              )}
            </div>
          </>
        )}

        <div className="space-y-2 border-t border-border pt-4">
          <Disclosure labelClosed="View VAISA activity" labelOpen="Hide VAISA activity">
            <ConversationTrace steps={record.trace} isSample={record.isSample} />
          </Disclosure>
          {record.knowledgeUsed.length > 0 && (
            <Disclosure labelClosed="View knowledge used" labelOpen="Hide knowledge used">
              <KnowledgeUsedList items={record.knowledgeUsed} />
            </Disclosure>
          )}
        </div>

        <p className="border-t border-border pt-3 font-mono text-[11px] text-ink-faint">
          {record.id} · {formatTimestamp(record.timestamp)}
        </p>
      </div>
    </div>
  );
}
