"use client";

import { ACCENT_CLASSES, type Accent } from "./accent";

export default function ProgressBar({
  label,
  percentage,
  accent,
  selected,
  onClick,
}: {
  label: string;
  percentage: number;
  accent: Accent;
  selected?: boolean;
  onClick?: () => void;
}) {
  const styles = ACCENT_CLASSES[accent];
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      className={`w-full rounded-lg px-2 py-1.5 text-left transition-colors duration-150 ${
        onClick ? "cursor-pointer hover:bg-surface-subtle" : ""
      } ${selected ? "bg-surface-subtle" : ""}`}
    >
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className={`font-medium ${selected ? "text-ink" : "text-ink-soft"}`}>{label}</span>
        <span className="tabular-nums text-ink-faint">{percentage}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
        <div
          className={`h-full rounded-full transition-all duration-200 ${styles.dot}`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </Wrapper>
  );
}
