import Link from "next/link";

export default function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-subtle/60 px-6 py-8 text-center">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-sm text-xs text-ink-faint">{description}</p>}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-dark hover:underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
