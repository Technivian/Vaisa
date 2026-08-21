/** Minimal hand-rolled line icons — no icon library dependency. Every
 * icon is a plain 18x18 stroke-based SVG so they read consistently at
 * sidebar/nav size. */
type IconProps = { className?: string };

const base = "stroke-current fill-none";

export function OverviewIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <g className={base} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="2.5" width="5.5" height="5.5" rx="1" />
        <rect x="10" y="2.5" width="5.5" height="8.5" rx="1" />
        <rect x="2.5" y="10.5" width="5.5" height="5" rx="1" />
        <rect x="10" y="13.5" width="5.5" height="2" rx="1" />
      </g>
    </svg>
  );
}

export function ConversationsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path
        className={base}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3.5h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8.5L5 15.5V12.5H3a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}

export function QualityIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path
        className={base}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 2 3.5 4v4.2c0 3.4 2.3 5.9 5.5 7.3 3.2-1.4 5.5-3.9 5.5-7.3V4L9 2Z"
      />
      <path
        className={base}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6.7 9 1.6 1.6 3-3.2"
      />
    </svg>
  );
}

export function KnowledgeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path
        className={base}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3.8c0-.5.4-.8.9-.7C5.5 3.4 7 4 8.5 4.9v9.3C7 13.3 5.5 12.7 3.9 12.4a.9.9 0 0 1-.9-.9V3.8Z"
      />
      <path
        className={base}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 3.8c0-.5-.4-.8-.9-.7C12.5 3.4 11 4 9.5 4.9v9.3c1.5-.9 3-1.5 4.6-1.8a.9.9 0 0 0 .9-.9V3.8Z"
      />
    </svg>
  );
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <g className={base} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.5 4.5h-3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3" />
        <path d="M9.5 3.5H14.5V8.5" />
        <path d="M14.2 3.8 8.5 9.5" />
      </g>
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path
        className={base}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 7 4 4 4-4"
      />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <g className={base} strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 5h12" />
        <path d="M3 9h12" />
        <path d="M3 13h12" />
      </g>
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <g className={base} strokeWidth="1.5" strokeLinecap="round">
        <path d="m4 4 10 10" />
        <path d="m14 4-10 10" />
      </g>
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <g className={base} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="4.5" />
        <path d="m14.5 14.5-3-3" />
      </g>
    </svg>
  );
}
