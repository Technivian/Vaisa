import type { ReactNode } from "react";

/** Native <details> disclosure, collapsed by default — accessible with no
 * JS state needed. Label swaps via the `group-open:` Tailwind variant. */
export default function Disclosure({
  labelClosed,
  labelOpen,
  defaultOpen,
  children,
}: {
  labelClosed: string;
  labelOpen: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details className="group" open={defaultOpen}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors duration-150 hover:border-brand hover:text-brand-dark [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">{labelClosed}</span>
        <span className="hidden group-open:inline">{labelOpen}</span>
        <span className="text-ink-faint transition-transform duration-150 group-open:rotate-180">⌄</span>
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
