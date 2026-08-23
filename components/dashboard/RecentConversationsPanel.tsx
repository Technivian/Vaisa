"use client";

import Link from "next/link";
import type { ConversationRecord } from "@/lib/conversationData";
import { getLanguageCode } from "@/lib/dashboardData";
import { useLocale } from "@/lib/i18n/LocaleContext";
import SectionPanel from "@/components/ui/SectionPanel";
import { OutcomeBadge } from "@/components/ui/StatusBadge";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** The most recent handful of conversations, resolved and escalated
 * mixed, so Overview reads as a live operational feed rather than a
 * static report. Full history, filters, and the inspector live at
 * /dashboard/conversations — each row deep-links there. */
export default function RecentConversationsPanel({ records }: { records: ConversationRecord[] }) {
  const { t } = useLocale();
  const recent = records.slice(0, 5);

  return (
    <SectionPanel
      title={t.overview.recentConversations.title}
      description={t.overview.recentConversations.subtitle}
    >
      <div className="divide-y divide-border">
        {recent.map((record) => (
          <Link
            key={record.id}
            href={`/dashboard/conversations?select=${record.id}`}
            className="flex items-center gap-3 py-2.5 text-sm transition-colors duration-150 hover:bg-surface-subtle"
          >
            <span className="w-11 shrink-0 tabular-nums text-ink-faint">{formatTime(record.timestamp)}</span>
            <span className="w-8 shrink-0 rounded-md bg-surface-subtle px-1.5 py-0.5 text-center text-[11px] font-semibold text-ink-soft">
              {getLanguageCode(record.language)}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium text-ink">{record.topic}</span>
            <OutcomeBadge outcome={record.outcome} />
          </Link>
        ))}
      </div>
    </SectionPanel>
  );
}
