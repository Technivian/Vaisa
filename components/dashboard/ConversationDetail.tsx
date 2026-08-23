"use client";

import { useState } from "react";
import type { EscalationStatus } from "@/lib/escalation";
import type { ConversationRecord } from "@/lib/conversationData";
import { getConversationStatus } from "@/lib/conversationData";
import { ConversationStatusBadge, SampleBadge } from "@/components/ui/StatusBadge";
import { ACCENT_CLASSES } from "@/components/ui/accent";
import Disclosure from "@/components/ui/Disclosure";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { format } from "@/lib/i18n/format";
import type { TranslationDict } from "@/lib/i18n/translations";
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

function translateLanguage(language: string, t: TranslationDict): string {
  return t.conversations.languageNames[language as keyof typeof t.conversations.languageNames] ?? language;
}

function buildSubtitle(record: ConversationRecord, t: TranslationDict): string {
  const parts = [record.topic, translateLanguage(record.language, t)];
  if (record.outcome === "resolved") {
    parts.push(formatDuration(record.durationSeconds));
  } else if (record.urgency) {
    parts.push(t.conversations.priorityPhrase[record.urgency]);
  }
  return parts.join(" · ");
}

/** Red is reserved for high-urgency safety-type cases; every other
 * escalation gets the calmer amber treatment, so the page doesn't read as
 * alarmed by default. */
function recommendedActionAccent(urgency: ConversationRecord["urgency"]) {
  return urgency === "high" ? ACCENT_CLASSES.danger : ACCENT_CLASSES.warning;
}

function Transcript({ record, t }: { record: ConversationRecord; t: TranslationDict }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
        {t.conversations.detail.conversationLabel}
      </p>
      {record.transcript.length === 0 ? (
        <p className="text-xs text-ink-faint">{t.conversations.detail.noTranscript}</p>
      ) : (
        <div className="space-y-3">
          {record.transcript.map((turn, i) => (
            <div key={i}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                {turn.role === "customer" ? t.conversations.detail.customerLabel : t.conversations.detail.vaisaLabel}
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
  const { t } = useLocale();
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
          <h2 className="text-sm font-semibold text-ink">
            {t.conversations.detail.conversationLabel} {record.id}
          </h2>
          <ConversationStatusBadge status={status} />
        </div>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-xs text-ink-faint">{buildSubtitle(record, t)}</p>
          {record.isSample && <SampleBadge />}
        </div>
      </div>

      <div className="space-y-5 px-5 py-4">
        {record.summary && <Block label={t.conversations.detail.summaryLabel}>{record.summary}</Block>}

        {isEscalated ? (
          <>
            {record.recommendedAction && (
              <div className={`rounded-lg border-l-[3px] ${actionAccent.border} ${actionAccent.bg} px-3.5 py-3`}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                  {t.conversations.detail.recommendedActionLabel}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-ink">{record.recommendedAction}</p>
                <div className="mt-3">
                  {caseStatus === "open" ? (
                    <button
                      type="button"
                      onClick={handleTakeCase}
                      className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-ink/85"
                    >
                      {t.conversations.detail.takeCase}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                      <span className="h-1.5 w-1.5 rounded-full bg-info" aria-hidden="true" />
                      {caseStatus === "resolved" ? t.common.status.resolved : t.conversations.detail.inReview}
                    </span>
                  )}
                </div>
              </div>
            )}

            <Transcript record={record} t={t} />

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                {t.conversations.detail.handoffLabel}
              </p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-[11px] text-ink-faint">{t.conversations.detail.priorityLabel}</p>
                  <p className="font-medium text-ink">
                    {record.urgency ? t.conversations.priorityWord[record.urgency] : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-ink-faint">{t.conversations.detail.categoryLabel}</p>
                  <p className="font-medium text-ink">{record.topic}</p>
                </div>
                <div>
                  <p className="text-[11px] text-ink-faint">{t.conversations.detail.languageLabel}</p>
                  <p className="font-medium text-ink">{translateLanguage(record.language, t)}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Transcript record={record} t={t} />

            <div className="rounded-lg border-l-[3px] border-success/25 bg-success-soft px-3.5 py-3">
              <p className="text-sm font-semibold text-success">{t.conversations.detail.resolvedByVaisa}</p>
              <p className="mt-1 text-xs text-ink-soft">{t.conversations.detail.noActionRequired}</p>
              {record.durationSeconds && (
                <p className="mt-2 text-[11px] text-ink-faint">
                  {format(t.conversations.detail.resolutionTime, { time: formatDuration(record.durationSeconds) })}
                </p>
              )}
            </div>
          </>
        )}

        <div className="space-y-2 border-t border-border pt-4">
          <Disclosure
            labelClosed={t.conversations.detail.viewActivity}
            labelOpen={t.conversations.detail.hideActivity}
          >
            <ConversationTrace steps={record.trace} isSample={record.isSample} />
          </Disclosure>
          {record.knowledgeUsed.length > 0 && (
            <Disclosure
              labelClosed={t.conversations.detail.viewKnowledge}
              labelOpen={t.conversations.detail.hideKnowledge}
            >
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
