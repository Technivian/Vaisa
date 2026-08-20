import type { ReactNode } from "react";
import { ACCENT_CLASSES, type Accent } from "./accent";

export default function InsightRow({
  accent = "ink",
  children,
}: {
  accent?: Accent;
  children: ReactNode;
}) {
  const styles = ACCENT_CLASSES[accent];
  return (
    <div className={`rounded-lg border-l-[3px] ${styles.border} ${styles.bg} px-3.5 py-2.5 text-sm text-ink-soft`}>
      {children}
    </div>
  );
}
