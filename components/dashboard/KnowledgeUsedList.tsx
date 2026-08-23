"use client";

import type { KnowledgeUsedItem } from "@/lib/conversationData";
import { getKnowledgeLabel } from "@/lib/knowledgeLabels";
import { useLocale } from "@/lib/i18n/LocaleContext";

export default function KnowledgeUsedList({ items }: { items: KnowledgeUsedItem[] }) {
  const { t } = useLocale();
  if (items.length === 0) return null;

  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li
          key={item.file}
          className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-subtle px-3 py-2"
        >
          <p className="min-w-0 truncate text-xs font-medium text-ink">{getKnowledgeLabel(item.file)}</p>
          <span className="shrink-0 rounded-full bg-info-soft px-2 py-0.5 text-[10px] font-semibold text-info">
            {t.common.verifiedSource}
          </span>
        </li>
      ))}
    </ul>
  );
}
