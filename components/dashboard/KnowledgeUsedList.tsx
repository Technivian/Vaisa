import type { KnowledgeUsedItem } from "@/lib/conversationData";

export default function KnowledgeUsedList({ items }: { items: KnowledgeUsedItem[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Knowledge used</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.file}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-subtle px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate font-mono text-xs font-medium text-ink">{item.file}</p>
              <p className="text-xs text-ink-faint">{item.description}</p>
            </div>
            <span className="shrink-0 rounded-full bg-info-soft px-2 py-0.5 text-[10px] font-semibold text-info">
              Verified source
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
