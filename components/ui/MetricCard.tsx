"use client";

import { ACCENT_CLASSES, type Accent } from "./accent";

export default function MetricCard({
  label,
  value,
  supportingText,
  accent,
  selected,
  onClick,
}: {
  label: string;
  value: string;
  supportingText: string;
  accent: Accent;
  selected?: boolean;
  onClick?: () => void;
}) {
  const styles = ACCENT_CLASSES[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group flex w-full flex-col items-start rounded-xl border bg-white px-4 py-4 text-left transition-all duration-150 ${
        selected
          ? `${styles.border} ring-1 ring-inset ${styles.border} shadow-sm`
          : "border-border hover:border-ink-faint/40 hover:shadow-sm"
      }`}
    >
      <span
        className={`mb-2 inline-flex h-1.5 w-6 rounded-full transition-colors duration-150 ${styles.dot}`}
        aria-hidden="true"
      />
      <p className="text-[32px] font-bold leading-none tracking-tight text-ink sm:text-[36px]">
        {value}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-ink">{label}</p>
      <p className="mt-0.5 text-xs text-ink-faint">{supportingText}</p>
    </button>
  );
}
