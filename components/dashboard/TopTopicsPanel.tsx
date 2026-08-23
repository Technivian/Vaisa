"use client";

import { useState } from "react";
import { CONTACT_REASONS } from "@/lib/dashboardData";
import { useLocale } from "@/lib/i18n/LocaleContext";
import SectionPanel from "@/components/ui/SectionPanel";
import ProgressBar from "@/components/ui/ProgressBar";
import InsightRow from "@/components/ui/InsightRow";

/** Maps CONTACT_REASONS' stable kebab-case ids to the camelCase keys used
 * in the translation dictionary. */
const TOPIC_KEY: Record<string, "orderDelivery" | "returns" | "productAdvice" | "technicalSupport" | "warranty"> = {
  "order-delivery": "orderDelivery",
  returns: "returns",
  "product-advice": "productAdvice",
  "technical-support": "technicalSupport",
  warranty: "warranty",
};

/** Compact version of the contact-reasons breakdown for Overview — tight
 * rows, no tall empty card. */
export default function TopTopicsPanel() {
  const { t } = useLocale();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = CONTACT_REASONS.find((r) => r.id === selectedId) ?? null;
  const selectedTopic = selected ? t.overview.topics[TOPIC_KEY[selected.id]] : null;

  return (
    <SectionPanel title={t.overview.topTopics.title} description={t.overview.topTopics.subtitle}>
      <div className="space-y-0.5">
        {CONTACT_REASONS.map((reason) => (
          <ProgressBar
            key={reason.id}
            label={t.overview.topics[TOPIC_KEY[reason.id]].label}
            percentage={reason.percentage}
            accent={reason.accent}
            selected={selectedId === reason.id}
            onClick={() => setSelectedId((prev) => (prev === reason.id ? null : reason.id))}
          />
        ))}
      </div>
      {selected && selectedTopic && (
        <div className="mt-2.5">
          <InsightRow accent={selected.accent}>
            <span className="font-semibold text-ink">{selectedTopic.label}</span>
            <span className="text-ink-faint">
              {" "}
              — {selected.conversations} {t.overview.topTopics.conversationsWord} · {selected.aiResolutionRate}%{" "}
              {t.overview.topTopics.aiResolutionWord}
            </span>
            <br />
            <span className="text-ink-faint">{t.overview.topTopics.topIntentsLabel} </span>
            <span>{selectedTopic.topIntents.join(" · ")}</span>
          </InsightRow>
        </div>
      )}
    </SectionPanel>
  );
}
