"use client";

import { useState } from "react";
import type { Escalation, EscalationStatus } from "@/lib/escalation";
import { selectDisplayCases } from "@/lib/dashboardData";
import {
  filterCases,
  DEFAULT_CASE_FILTERS,
  type PriorityFilter,
  type LanguageFilter,
  type StatusFilter,
} from "@/lib/dashboardFilters";
import { updateEscalationStatus } from "@/lib/clientEscalations";
import SectionPanel from "@/components/ui/SectionPanel";
import FilterControl from "@/components/ui/FilterControl";
import EscalationRow, { CASE_GRID_COLS } from "@/components/ui/EscalationRow";
import EmptyState from "@/components/ui/EmptyState";
import CaseDetail from "./CaseDetail";

const PRIORITY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
const LANGUAGE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "NL", label: "NL" },
  { value: "DE", label: "DE" },
  { value: "FR", label: "FR" },
  { value: "EN", label: "EN" },
];
const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "review", label: "Review" },
  { value: "resolved", label: "Resolved" },
];

export default function CasesSection({ realEscalations }: { realEscalations: Escalation[] }) {
  const [filters, setFilters] = useState(DEFAULT_CASE_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const hasRealCases = realEscalations.length > 0;
  const baseCases = selectDisplayCases(realEscalations);

  const filtered = filterCases(baseCases, filters);
  const effectiveSelectedId = selectedId ?? filtered[0]?.id ?? null;
  const selected = filtered.find((c) => c.id === effectiveSelectedId) ?? null;

  function handleStatusChange(id: string, status: EscalationStatus) {
    updateEscalationStatus(id, status);
    // No local state update needed — DashboardClient's useSyncExternalStore
    // picks up the write (via the custom change event in
    // lib/clientEscalations.ts) and re-renders with the fresh list.
  }

  return (
    <SectionPanel
      title="Cases requiring attention"
      description={hasRealCases ? "Escalations from this browser's VAISA sessions" : undefined}
    >
      <div className="flex flex-wrap items-center gap-2.5 border-b border-border pb-3">
        <input
          type="text"
          placeholder="Search cases..."
          value={filters.query}
          onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
          className="min-w-[160px] flex-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-ink outline-none transition-colors focus:border-brand"
        />
        <FilterControl
          label="Priority"
          value={filters.priority}
          options={PRIORITY_OPTIONS}
          onChange={(v) => setFilters((f) => ({ ...f, priority: v as PriorityFilter }))}
        />
        <FilterControl
          label="Language"
          value={filters.language}
          options={LANGUAGE_OPTIONS}
          onChange={(v) => setFilters((f) => ({ ...f, language: v as LanguageFilter }))}
        />
        <FilterControl
          label="Status"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(v) => setFilters((f) => ({ ...f, status: v as StatusFilter }))}
        />
      </div>

      <p className="py-2 text-xs text-ink-faint">
        Showing {filtered.length} case{filtered.length === 1 ? "" : "s"}
      </p>

      {!hasRealCases && (
        <div className="mb-3 space-y-2.5">
          <EmptyState
            title="No live demo escalations yet"
            description="Trigger a human handoff in the VAISA assistant to see it appear here."
            actionHref="/"
            actionLabel="← Open VAISA assistant"
          />
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Example cases
          </p>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="px-1 py-8 text-center text-sm text-ink-faint">No cases match these filters.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="overflow-hidden rounded-lg border border-border lg:col-span-3">
            <div
              className={`hidden border-b border-border bg-surface-subtle px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint md:grid ${CASE_GRID_COLS}`}
            >
              <span>Priority</span>
              <span>Issue</span>
              <span>Category</span>
              <span>Lang</span>
              <span>Time</span>
              <span>Status</span>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {filtered.map((c) => (
                <EscalationRow
                  key={c.id}
                  item={c}
                  selected={effectiveSelectedId === c.id}
                  onSelect={() => setSelectedId(c.id)}
                />
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border lg:col-span-2">
            {selected && (
              <CaseDetail
                item={selected}
                onStatusChange={
                  selected.isSample
                    ? undefined
                    : (status) => handleStatusChange(selected.id, status)
                }
              />
            )}
          </div>
        </div>
      )}
    </SectionPanel>
  );
}
