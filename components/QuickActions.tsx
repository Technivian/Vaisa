"use client";

import { useLocale } from "@/lib/i18n/LocaleContext";

export default function QuickActions({
  onSelect,
  disabled,
}: {
  onSelect: (text: string) => void;
  disabled?: boolean;
}) {
  const { t } = useLocale();

  const actions = [
    { emoji: "📦", label: t.quickActions.orderStatus },
    { emoji: "↩️", label: t.quickActions.returnItem },
    { emoji: "🔧", label: t.quickActions.machineNotWorking },
    { emoji: "🔋", label: t.quickActions.batteryQuestion },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(action.label)}
          className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors duration-150 hover:border-brand hover:bg-brand-soft/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-base">{action.emoji}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
