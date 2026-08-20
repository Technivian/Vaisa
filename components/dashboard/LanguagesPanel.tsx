import { LANGUAGE_SHARE } from "@/lib/dashboardData";
import SectionPanel from "@/components/ui/SectionPanel";

export default function LanguagesPanel() {
  return (
    <SectionPanel
      title="Customer languages"
      description="VAISA automatically detects and responds in the customer's language."
    >
      <div className="space-y-2.5">
        {LANGUAGE_SHARE.map((lang) => (
          <div key={lang.code} className="flex items-center gap-3 text-sm">
            <span className="w-8 shrink-0 rounded-md bg-surface-subtle px-1.5 py-0.5 text-center text-[11px] font-semibold text-ink-soft">
              {lang.code}
            </span>
            <span className="w-16 shrink-0 text-ink-soft">{lang.label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-subtle">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${lang.percentage}%` }}
              />
            </div>
            <span className="w-9 shrink-0 text-right tabular-nums text-xs text-ink-faint">
              {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    </SectionPanel>
  );
}
