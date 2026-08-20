export interface UIMessage {
  id: string;
  role: "customer" | "assistant";
  text: string;
  escalationId?: string;
  isError?: boolean;
}

export default function Message({ message }: { message: UIMessage }) {
  const isCustomer = message.role === "customer";

  return (
    <div className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
          isCustomer
            ? "bg-ink text-white rounded-br-sm"
            : message.isError
              ? "bg-red-50 text-red-800 border border-red-200 rounded-bl-sm"
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
    </div>
  );
}
