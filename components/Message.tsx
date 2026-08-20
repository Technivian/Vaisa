export interface UIMessage {
  id: string;
  role: "customer" | "assistant";
  text: string;
  escalationId?: string;
  isError?: boolean;
  /** ISO timestamp, set client-side when the message is created. Left
   * unset for the static canned greeting (a module-level constant) to
   * avoid a server/client hydration mismatch from `new Date()`. */
  timestamp?: string;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("nl-NL", {
    timeZone: "Europe/Amsterdam",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Message({ message }: { message: UIMessage }) {
  const isCustomer = message.role === "customer";

  return (
    <div className={`flex flex-col ${isCustomer ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
          isCustomer
            ? "bg-ink text-white rounded-br-sm"
            : message.isError
              ? "bg-danger-soft text-danger border border-danger/25 rounded-bl-sm"
              : "bg-surface text-ink border border-border rounded-bl-sm"
        }`}
      >
        {message.text}
        {message.escalationId && (
          <div className="mt-2 pt-2 border-t border-black/10 text-xs font-medium text-brand-dark flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
            Case {message.escalationId} passed to a colleague
          </div>
        )}
      </div>
      {message.timestamp && (
        <span className="mt-1 px-1 text-[11px] text-ink-faint">{formatTime(message.timestamp)}</span>
      )}
    </div>
  );
}
