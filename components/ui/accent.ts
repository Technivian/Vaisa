/** Shared semantic accent tokens used across the VAISA dashboard's design
 * system components (MetricCard, ProgressBar, StatusBadge, InsightRow).
 * Colour is used sparingly and consistently: `dot`/`text` carry meaning,
 * `bg`/`border` stay soft so the interface doesn't turn into a rainbow. */
export type Accent = "brand" | "success" | "warning" | "danger" | "info" | "ink";

interface AccentClasses {
  text: string;
  bg: string;
  border: string;
  dot: string;
}

export const ACCENT_CLASSES: Record<Accent, AccentClasses> = {
  brand: { text: "text-brand-dark", bg: "bg-brand-soft", border: "border-brand/25", dot: "bg-brand" },
  success: { text: "text-success", bg: "bg-success-soft", border: "border-success/25", dot: "bg-success" },
  warning: { text: "text-warning", bg: "bg-warning-soft", border: "border-warning/25", dot: "bg-warning" },
  danger: { text: "text-danger", bg: "bg-danger-soft", border: "border-danger/25", dot: "bg-danger" },
  info: { text: "text-info", bg: "bg-info-soft", border: "border-info/25", dot: "bg-info" },
  ink: { text: "text-ink-soft", bg: "bg-surface-subtle", border: "border-border", dot: "bg-ink-faint" },
};
