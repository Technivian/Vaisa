const ACTIONS = [
  { emoji: "📦", label: "Waar is mijn bestelling?" },
  { emoji: "↩️", label: "Ik wil iets retourneren" },
  { emoji: "🔧", label: "Mijn machine werkt niet" },
  { emoji: "🔋", label: "Welke accu heb ik nodig?" },
];

export default function QuickActions({
  onSelect,
  disabled,
}: {
  onSelect: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(action.label)}
          className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:border-brand hover:bg-orange-50/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-base">{action.emoji}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
