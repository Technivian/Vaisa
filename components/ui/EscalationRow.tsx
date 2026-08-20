"use client";

import type { DisplayCase } from "@/lib/dashboardData";
import { formatCategory, getLanguageCode, getShortText } from "@/lib/dashboardData";
import { PriorityBadge, CaseStatusBadge, SampleBadge } from "./StatusBadge";

/** Shared grid-column template so the desktop header row and every
 * EscalationRow line up exactly. */
export const CASE_GRID_COLS = "md:grid-cols-[62px_1fr_88px_40px_52px_78px]";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EscalationRow({
  item,
  selected,
  onSelect,
}: {
  item: DisplayCase;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`grid w-full grid-cols-1 gap-2 border-b border-border px-3 py-3 text-left transition-colors duration-150 last:border-b-0 md:items-center md:gap-2 ${CASE_GRID_COLS} ${
        selected ? "bg-brand-soft/50" : "hover:bg-surface-subtle"
      }`}
    >
      <div className="flex items-center gap-2 md:block">
        <PriorityBadge urgency={item.urgency} />
        {item.isSample && <span className="md:hidden">{<SampleBadge />}</span>}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{getShortText(item.summary, 70)}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-ink-faint">
          {item.id}
          {item.isSample && <span className="hidden md:inline">{<SampleBadge />}</span>}
        </p>
      </div>

      <div className="text-xs text-ink-soft md:text-[13px]">{formatCategory(item.reason)}</div>
      <div className="text-xs text-ink-soft md:text-[13px]">{getLanguageCode(item.customerLanguage)}</div>
      <div className="text-xs text-ink-faint md:text-[13px]">{formatTime(item.timestamp)}</div>
      <div>
        <CaseStatusBadge status={item.status} />
      </div>
    </button>
  );
}
