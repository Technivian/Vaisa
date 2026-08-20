import type { Escalation } from "@/lib/escalation";

const URGENCY_STYLES: Record<Escalation["urgency"], string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
};

function formatReason(reason: string): string {
  return reason
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function HandoffCard({ escalation }: { escalation: Escalation }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">
            Customer Service Handoff
          </h2>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${URGENCY_STYLES[escalation.urgency]}`}
          >
            {escalation.urgency} urgency
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-ink/40">{escalation.id}</p>
      </div>

      <div className="space-y-5 px-5 py-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Language</p>
          <p className="mt-1 text-ink">{escalation.customerLanguage}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Issue</p>
          <p className="mt-1 text-ink">{escalation.summary}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Classification</p>
          <p className="mt-1 text-ink">{formatReason(escalation.reason)}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
            Recommended action
          </p>
          <p className="mt-1 text-ink">{escalation.recommendedAction}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Received</p>
          <p className="mt-1 text-ink">
            {new Date(escalation.timestamp).toLocaleString("nl-NL", {
              timeZone: "Europe/Amsterdam",
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/40">
            Conversation
          </p>
          <div className="space-y-2 rounded-xl border border-border bg-surface p-3">
            {escalation.transcript.length === 0 && (
              <p className="text-xs text-ink/40">No transcript captured.</p>
            )}
            {escalation.transcript.map((turn, i) => (
              <div key={i} className="text-xs">
                <span
                  className={`font-semibold ${turn.role === "customer" ? "text-ink" : "text-brand-dark"}`}
                >
                  {turn.role === "customer" ? "Customer" : "Assistant"}:
                </span>{" "}
                <span className="text-ink/80">{turn.content}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
