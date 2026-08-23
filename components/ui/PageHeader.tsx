import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="bg-brand text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
              {eyebrow}
            </p>
          )}
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
            <h1 className="text-[26px] font-semibold leading-tight tracking-tight sm:text-[28px]">
              {title}
            </h1>
            {subtitle && <span className="text-sm font-medium text-white/80">{subtitle}</span>}
          </div>
          {description && <p className="mt-1 text-[11px] text-white/70">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
