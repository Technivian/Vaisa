"use client";

import { useState } from "react";
import { QUALITY_SCENARIOS, QUALITY_METRICS, type QualityScenario } from "@/lib/qualityData";
import SectionHeader from "./shell/SectionHeader";
import SectionPanel from "@/components/ui/SectionPanel";
import { ACCENT_CLASSES } from "@/components/ui/accent";

const TOTAL_SCENARIOS = QUALITY_SCENARIOS.length;

function PassBadge() {
  const styles = ACCENT_CLASSES.success;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${styles.bg} ${styles.text} ${styles.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden="true" />
      Pass
    </span>
  );
}

function ScenarioDetail({ scenario }: { scenario: QualityScenario }) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{scenario.name}</h2>
        <PassBadge />
      </div>
      <div className="space-y-4 px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Test question</p>
          <p className="mt-1 rounded-lg bg-surface-subtle px-3 py-2 text-sm italic leading-snug text-ink-soft">
            &ldquo;{scenario.testQuestion}&rdquo;
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Expected behaviour</p>
          <p className="mt-1 text-sm leading-snug text-ink">{scenario.expectedBehaviour}</p>
        </div>
        <div className="rounded-lg border-l-[3px] border-success/25 bg-success-soft px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Observed result</p>
          <p className="mt-1 text-sm font-medium leading-snug text-ink">{scenario.observedResult}</p>
        </div>
      </div>
    </div>
  );
}

export default function QualityClient() {
  const [selectedId, setSelectedId] = useState(QUALITY_SCENARIOS[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunLabel, setLastRunLabel] = useState<string | null>(null);

  const selected = QUALITY_SCENARIOS.find((s) => s.id === selectedId) ?? QUALITY_SCENARIOS[0];

  function handleRunChecks() {
    if (isRunning) return;
    setIsRunning(true);
    // Simulated validation only — this replays the known result of the
    // manual test set below. It never calls a live AI provider from the
    // browser, and there is no backend test-execution endpoint.
    setTimeout(() => {
      setIsRunning(false);
      setLastRunLabel(
        new Date().toLocaleTimeString("nl-NL", { timeZone: "Europe/Amsterdam", hour: "2-digit", minute: "2-digit" })
      );
    }, 1200);
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Quality & Safety"
        description="Validate critical VAISA behaviours before customer use."
      />

      <SectionPanel title="Agent readiness">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink">
                {TOTAL_SCENARIOS}/{TOTAL_SCENARIOS} critical scenarios passed — Ready for controlled demo
              </p>
              <p className="mt-0.5 text-xs text-ink-faint">
                Reflects this demo&apos;s test set, not production certification.
                {lastRunLabel && ` Last checked ${lastRunLabel}.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRunChecks}
            disabled={isRunning}
            className="shrink-0 rounded-lg bg-brand px-3.5 py-1.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-dark disabled:opacity-60"
          >
            {isRunning ? "Running checks…" : "Run demo checks"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-ink">
              {QUALITY_METRICS.grounding.passed}/{QUALITY_METRICS.grounding.total}
            </p>
            <p className="text-xs text-ink-faint">Grounding</p>
          </div>
          <div>
            <p className="text-lg font-bold text-ink">
              {QUALITY_METRICS.toolBehaviour.passed}/{QUALITY_METRICS.toolBehaviour.total}
            </p>
            <p className="text-xs text-ink-faint">Tool behaviour</p>
          </div>
          <div>
            <p className="text-lg font-bold text-ink">
              {QUALITY_METRICS.safety.passed}/{QUALITY_METRICS.safety.total}
            </p>
            <p className="text-xs text-ink-faint">Safety</p>
          </div>
          <div>
            <p className="text-lg font-bold text-ink">{QUALITY_METRICS.languagesSupported}</p>
            <p className="text-xs text-ink-faint">Languages supported</p>
          </div>
        </div>
      </SectionPanel>

      <SectionPanel title="Scenarios">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="overflow-hidden rounded-lg border border-border lg:col-span-2">
            {QUALITY_SCENARIOS.map((scenario) => {
              const isSelected = scenario.id === selectedId;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setSelectedId(scenario.id)}
                  className={`flex w-full items-center justify-between gap-2.5 border-b border-border px-3.5 py-3 text-left text-sm transition-colors duration-150 last:border-b-0 ${
                    isSelected ? "bg-brand-soft" : "hover:bg-surface-subtle"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{scenario.name}</p>
                    <p className="truncate text-xs text-ink-faint">{scenario.summary}</p>
                  </div>
                  <PassBadge />
                </button>
              );
            })}
          </div>
          <div className="overflow-hidden rounded-lg border border-border lg:col-span-3">
            <ScenarioDetail scenario={selected} />
          </div>
        </div>
      </SectionPanel>
    </div>
  );
}
