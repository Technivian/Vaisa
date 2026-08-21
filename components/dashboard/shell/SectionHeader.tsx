import type { ReactNode } from "react";

/**
 * Simplified in-content page header for dashboard routes. The sidebar
 * already establishes VAISA/VONROC product identity, so this doesn't
 * repeat "VAISA Service Operations" branding on every page — just the
 * page's own title, a one-line description, and optional controls.
 */
export default function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-faint">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
