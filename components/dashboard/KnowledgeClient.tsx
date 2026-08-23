"use client";

import { useState } from "react";
import {
  KNOWLEDGE_SOURCES,
  KNOWLEDGE_PRODUCT_COUNT,
  COVERAGE,
  KNOWN_SOURCE_CONFLICTS,
  type KnowledgeSource,
  type CoverageRow,
} from "@/lib/knowledgeSourceData";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { format } from "@/lib/i18n/format";
import type { TranslationDict } from "@/lib/i18n/translations";
import SectionHeader from "./shell/SectionHeader";
import SectionPanel from "@/components/ui/SectionPanel";
import { ACCENT_CLASSES } from "@/components/ui/accent";

const TOTAL_SOURCES = KNOWLEDGE_SOURCES.length;

function CoverageBadge({ status, t }: { status: CoverageRow["status"]; t: TranslationDict }) {
  const styles = ACCENT_CLASSES[status === "Ready" ? "success" : "warning"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${styles.bg} ${styles.text} ${styles.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {t.knowledge.coverageStatus[status]}
    </span>
  );
}

function VerifiedBadge({ t }: { t: TranslationDict }) {
  const styles = ACCENT_CLASSES.info;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${styles.bg} ${styles.text} ${styles.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      {t.knowledge.verifiedBadge}
    </span>
  );
}

function SourceDetail({ source, t }: { source: KnowledgeSource; t: TranslationDict }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{source.name}</h2>
        <VerifiedBadge t={t} />
      </div>
      <div className="space-y-4 px-5 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{t.knowledge.typeLabel}</p>
            <p className="mt-1 text-sm text-ink">{t.knowledge.sourceTypes[source.type]}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{t.knowledge.statusLabel}</p>
            <p className="mt-1 text-sm text-ink">{t.knowledge.verifiedBadge}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{t.knowledge.sourceLabel}</p>
          <p className="mt-1 text-sm text-ink">{source.source}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{t.knowledge.usedForLabel}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {source.usedFor.map((item) => (
              <span key={item} className="rounded-full bg-surface-subtle px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                {item}
              </span>
            ))}
          </div>
        </div>
        {source.keyFacts && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{t.knowledge.keyFactsLabel}</p>
            <ul className="mt-1.5 space-y-1">
              {source.keyFacts.map((fact) => (
                <li key={fact} className="text-sm text-ink">
                  • {fact}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="border-t border-border pt-3 text-xs text-ink-faint">
          {format(t.knowledge.lastRetrieved, {
            date: source.lastRetrieved,
            coverage: t.knowledge.coverageAreas[source.coverage as keyof typeof t.knowledge.coverageAreas] ?? source.coverage,
          })}
        </p>
      </div>
    </div>
  );
}

export default function KnowledgeClient() {
  const { t } = useLocale();
  const [selectedId, setSelectedId] = useState(KNOWLEDGE_SOURCES[0].id);
  const selected = KNOWLEDGE_SOURCES.find((s) => s.id === selectedId) ?? KNOWLEDGE_SOURCES[0];

  return (
    <div className="space-y-5">
      <SectionHeader title={t.knowledge.title} description={t.knowledge.description} />

      <SectionPanel title={t.knowledge.healthTitle}>
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
          <p className="text-sm font-semibold text-ink">{t.knowledge.healthy}</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
          <div>
            <p className="text-lg font-bold text-ink">{TOTAL_SOURCES}</p>
            <p className="text-xs text-ink-faint">{t.knowledge.verifiedSources}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-ink">{KNOWLEDGE_PRODUCT_COUNT}</p>
            <p className="text-xs text-ink-faint">{t.knowledge.productsCovered}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-ink">{KNOWN_SOURCE_CONFLICTS}</p>
            <p className="text-xs text-ink-faint">{t.knowledge.knownConflicts}</p>
          </div>
        </div>
      </SectionPanel>

      <SectionPanel title={t.knowledge.coverageTitle}>
        <div className="divide-y divide-border">
          {COVERAGE.map((row) => (
            <div key={row.area} className="flex items-center justify-between py-2 text-sm">
              <span className="text-ink">
                {t.knowledge.coverageAreas[row.area as keyof typeof t.knowledge.coverageAreas] ?? row.area}
              </span>
              <CoverageBadge status={row.status} t={t} />
            </div>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel title={t.knowledge.sourcesTitle}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="overflow-hidden rounded-lg border border-border lg:col-span-2">
            {KNOWLEDGE_SOURCES.map((source) => {
              const isSelected = source.id === selectedId;
              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => setSelectedId(source.id)}
                  className={`flex w-full items-center justify-between gap-2.5 border-b border-border px-3.5 py-3 text-left text-sm transition-colors duration-150 last:border-b-0 ${
                    isSelected ? "bg-brand-soft" : "hover:bg-surface-subtle"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{source.name}</p>
                    <p className="truncate text-xs text-ink-faint">
                      {t.knowledge.sourceTypes[source.type]} ·{" "}
                      {t.knowledge.coverageAreas[source.coverage as keyof typeof t.knowledge.coverageAreas] ??
                        source.coverage}
                    </p>
                  </div>
                  <VerifiedBadge t={t} />
                </button>
              );
            })}
          </div>
          <div className="overflow-hidden rounded-lg border border-border lg:col-span-3">
            <SourceDetail source={selected} t={t} />
          </div>
        </div>
      </SectionPanel>
    </div>
  );
}
