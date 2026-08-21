/** A KPI trend delta, e.g. "+12%". `sentiment` is passed explicitly by
 * the caller rather than inferred from the sign — a falling escalation
 * count is a *good* trend even though the number is negative. */
export default function TrendBadge({
  value,
  sentiment,
}: {
  value: number;
  sentiment: "positive" | "negative" | "neutral";
}) {
  const sign = value > 0 ? "+" : "";
  const colorClass =
    sentiment === "positive"
      ? "text-success"
      : sentiment === "negative"
        ? "text-danger"
        : "text-ink-faint";

  return (
    <span className={`text-xs font-semibold tabular-nums ${colorClass}`}>
      {sign}
      {value}%
    </span>
  );
}
