"use client";

import { useState } from "react";
import type { TrendPoint } from "@/lib/conversationData";

const WIDTH = 600;
const HEIGHT = 200;
const PADDING = { top: 12, right: 12, bottom: 24, left: 30 };
const GRID_LINES = [0, 25, 50, 75, 100];

/** Native-SVG line chart for the seven-day performance trend — no
 * charting dependency. Responsive via viewBox; hover (desktop) or tap
 * (mobile, via onClick on the same hit-target) reveals the value for a
 * given day. */
export default function PerformanceLineChart({ data }: { data: TrendPoint[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartWidth = WIDTH - PADDING.left - PADDING.right;
  const chartHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const step = data.length > 1 ? chartWidth / (data.length - 1) : 0;

  const xFor = (i: number) => PADDING.left + i * step;
  const yFor = (value: number) => PADDING.top + chartHeight - (value / 100) * chartHeight;

  const linePath = (key: "resolved" | "escalated") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(d[key])}`).join(" ");

  const active = activeIndex !== null ? data[activeIndex] : null;
  const hitWidth = data.length > 0 ? chartWidth / data.length : chartWidth;

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label="Seven day performance trend: AI resolution vs human escalation">
        {GRID_LINES.map((g) => (
          <g key={g}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={yFor(g)}
              y2={yFor(g)}
              className="stroke-border"
              strokeWidth="1"
            />
            <text x={PADDING.left - 6} y={yFor(g) + 3} textAnchor="end" fontSize="9" className="fill-ink-faint">
              {g}%
            </text>
          </g>
        ))}

        {data.map((d, i) => (
          <text key={d.label} x={xFor(i)} y={HEIGHT - 6} textAnchor="middle" fontSize="9" className="fill-ink-faint">
            {d.label}
          </text>
        ))}

        <path d={linePath("resolved")} fill="none" className="stroke-success" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={linePath("escalated")} fill="none" className="stroke-warning" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {activeIndex !== null && (
          <line
            x1={xFor(activeIndex)}
            x2={xFor(activeIndex)}
            y1={PADDING.top}
            y2={PADDING.top + chartHeight}
            className="stroke-ink-faint"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        )}

        {data.map((d, i) => (
          <g key={d.label}>
            <circle cx={xFor(i)} cy={yFor(d.resolved)} r={activeIndex === i ? 4 : 3} className="fill-success" />
            <circle cx={xFor(i)} cy={yFor(d.escalated)} r={activeIndex === i ? 4 : 3} className="fill-warning" />
            <rect
              x={xFor(i) - hitWidth / 2}
              y={PADDING.top}
              width={hitWidth}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setActiveIndex((prev) => (prev === i ? null : i))}
              onFocus={() => setActiveIndex(i)}
              tabIndex={0}
              role="button"
              aria-label={`${d.label}: ${d.resolved}% resolved, ${d.escalated}% escalated`}
            />
          </g>
        ))}
      </svg>

      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-ink-soft">
            <span className="h-2 w-2 rounded-full bg-success" /> AI resolution
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink-soft">
            <span className="h-2 w-2 rounded-full bg-warning" /> Human escalation
          </span>
        </div>
        <span className="font-medium text-ink">
          {active ? (
            <>
              {active.label}: <span className="text-success">{active.resolved}%</span> /{" "}
              <span className="text-warning">{active.escalated}%</span>
            </>
          ) : (
            <span className="text-ink-faint">Hover or tap a day</span>
          )}
        </span>
      </div>
    </div>
  );
}
