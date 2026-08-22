"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { EscalationStatus } from "@/lib/escalation";
import { useRealEscalations } from "@/lib/useRealEscalations";
import { selectConversationRecords, getConversationStatus } from "@/lib/conversationData";
import { updateEscalationStatus } from "@/lib/clientEscalations";
import {
  filterConversations,
  sortConversationsByPriority,
  uniqueTopics,
  DEFAULT_CONVERSATION_FILTERS,
  type OutcomeFilter,
  type LanguageFilter,
} from "@/lib/conversationFilters";
import { getLanguageCode } from "@/lib/dashboardData";
import SectionHeader from "./shell/SectionHeader";
import SectionPanel from "@/components/ui/SectionPanel";
import FilterControl from "@/components/ui/FilterControl";
import { ConversationStatusBadge } from "@/components/ui/StatusBadge";
import type { ConversationStatus } from "@/lib/conversationData";
import ConversationDetail from "./ConversationDetail";

/** Left-border accent for a selected row — side-specific so it never
 * bleeds into the row's neutral bottom divider. Soft opacity keeps
 * selection "subtle semantic styling," not a saturated fill. */
const SELECTED_ROW_ACCENT: Record<ConversationStatus, string> = {
  resolved: "border-l-success/25",
  escalated: "border-l-warning/25",
  urgent: "border-l-danger/25",
};

const OUTCOME_OPTIONS = [
  { value: "all", label: "All" },
  { value: "resolved", label: "Resolved" },
  { value: "escalated", label: "Escalated" },
];
const LANGUAGE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "NL", label: "NL" },
  { value: "DE", label: "DE" },
  { value: "FR", label: "FR" },
  { value: "EN", label: "EN" },
];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConversationsClient() {
  const searchParams = useSearchParams();
  const preselectId = searchParams.get("select");

  const [filters, setFilters] = useState(DEFAULT_CONVERSATION_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(preselectId);

  const realEscalations = useRealEscalations();
  const records = selectConversationRecords(realEscalations);
  const topics = uniqueTopics(records);
  const sorted = sortConversationsByPriority(filterConversations(records, filters));

  const effectiveSelectedId = selectedId ?? sorted[0]?.id ?? null;
  const selected = sorted.find((r) => r.id === effectiveSelectedId) ?? records.find((r) => r.id === effectiveSelectedId) ?? null;

  function handleStatusChange(id: string, status: EscalationStatus) {
    updateEscalationStatus(id, status);
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Conversations"
        description="Inspect how VAISA handled individual customer interactions."
      />

      <SectionPanel title="All conversations" description={`${sorted.length} of ${records.length} shown`}>
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border pb-3">
          <input
            type="text"
            placeholder="Search conversations..."
            value={filters.query}
            onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            className="min-w-[160px] flex-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-ink outline-none transition-colors focus:border-brand"
          />
          <FilterControl
            label="Outcome"
            value={filters.outcome}
            options={OUTCOME_OPTIONS}
            onChange={(v) => setFilters((f) => ({ ...f, outcome: v as OutcomeFilter }))}
          />
          <FilterControl
            label="Language"
            value={filters.language}
            options={LANGUAGE_OPTIONS}
            onChange={(v) => setFilters((f) => ({ ...f, language: v as LanguageFilter }))}
          />
          <FilterControl
            label="Topic"
            value={filters.topic}
            options={[{ value: "all", label: "All" }, ...topics.map((t) => ({ value: t, label: t }))]}
            onChange={(v) => setFilters((f) => ({ ...f, topic: v }))}
          />
        </div>

        {sorted.length === 0 ? (
          <p className="px-1 py-8 text-center text-sm text-ink-faint">No conversations match these filters.</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-5">
            <div className="overflow-hidden rounded-lg border border-border lg:col-span-2">
              <div className="max-h-[600px] overflow-y-auto">
                {sorted.map((record) => {
                  const isSelected = effectiveSelectedId === record.id;
                  const rowStatus = getConversationStatus(record);
                  return (
                    <button
                      key={record.id}
                      type="button"
                      onClick={() => setSelectedId(record.id)}
                      className={`flex w-full items-center gap-2.5 border-b border-l-[3px] border-b-border px-3 py-2.5 text-left text-sm transition-colors duration-150 last:border-b-0 ${
                        isSelected
                          ? `${SELECTED_ROW_ACCENT[rowStatus]} bg-surface-subtle`
                          : "border-l-transparent hover:bg-surface-subtle"
                      }`}
                    >
                      <span className="w-11 shrink-0 tabular-nums text-xs text-ink-faint">
                        {formatTime(record.timestamp)}
                      </span>
                      <span className="w-8 shrink-0 rounded-md bg-surface-subtle px-1.5 py-0.5 text-center text-[11px] font-semibold text-ink-soft">
                        {getLanguageCode(record.language)}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium text-ink">{record.topic}</span>
                      <ConversationStatusBadge status={rowStatus} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border lg:col-span-3">
              {selected && (
                <ConversationDetail
                  key={selected.id}
                  record={selected}
                  onStatusChange={
                    selected.isSample ? undefined : (status) => handleStatusChange(selected.id, status)
                  }
                />
              )}
            </div>
          </div>
        )}
      </SectionPanel>
    </div>
  );
}
