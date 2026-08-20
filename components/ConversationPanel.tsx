"use client";

import { useState } from "react";
import type { Escalation } from "@/lib/escalation";
import HandoffCard from "./HandoffCard";

const URGENCY_DOT: Record<Escalation["urgency"], string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-slate-400",
};

export default function ConversationPanel({ escalations }: { escalations: Escalation[] }) {
  // `escalations` arrives asynchronously (read from localStorage after
  // mount), so it's empty on the very first render. Falling back to the
  // first escalation here — rather than only in the useState initializer —
  // means selection still defaults correctly once the real list loads.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const effectiveSelectedId = selectedId ?? escalations[0]?.id ?? null;
  const selected = escalations.find((e) => e.id === effectiveSelectedId) ?? null;

  if (escalations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-white px-6 py-12 text-center text-sm text-ink/50">
        No escalations yet. Cases handed off by the AI assistant will appear here.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <div className="overflow-hidden rounded-xl border border-border bg-white lg:col-span-2">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-ink">Escalation queue</h2>
        </div>
        <ul className="max-h-[520px] divide-y divide-border overflow-y-auto">
          {escalations.map((escalation) => (
            <li key={escalation.id}>
              <button
                type="button"
                onClick={() => setSelectedId(escalation.id)}
                className={`w-full px-4 py-3 text-left transition-colors hover:bg-surface ${
                  effectiveSelectedId === escalation.id ? "bg-orange-50/60" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${URGENCY_DOT[escalation.urgency]}`}
                    />
                    <span className="text-xs font-semibold text-ink">{escalation.customerLanguage}</span>
                  </div>
                  <span className="text-[11px] text-ink/40">
                    {new Date(escalation.timestamp).toLocaleTimeString("nl-NL", {
                      timeZone: "Europe/Amsterdam",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-ink/70">{escalation.summary}</p>
                <p className="mt-1 font-mono text-[10px] text-ink/30">{escalation.id} · {escalation.status}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white lg:col-span-3">
        {selected ? (
          <HandoffCard escalation={selected} />
        ) : (
          <div className="px-6 py-12 text-center text-sm text-ink/50">Select a case to view details.</div>
        )}
      </div>
    </div>
  );
}
