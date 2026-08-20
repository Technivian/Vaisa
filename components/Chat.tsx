"use client";

import { useState, useRef, useEffect } from "react";
import Message, { type UIMessage } from "./Message";
import QuickActions from "./QuickActions";

type TranscriptItem = Record<string, unknown>;

const GREETING: UIMessage = {
  id: "greeting",
  role: "assistant",
  text: "Hoi! Ik ben de VONROC klantenservice-assistent (demo). Waarmee kan ik je helpen? U kunt mij ook in het Engels, Duits of Frans schrijven.",
};

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-ink/40 animate-bounce"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<UIMessage[]>([GREETING]);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { id: newId(), role: "customer", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, message: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            text: data.error || "Something went wrong. Please try again.",
            isError: true,
          },
        ]);
        return;
      }

      setTranscript(Array.isArray(data.transcript) ? data.transcript : []);
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          text: data.reply || "...",
          escalationId: data.escalation?.id,
          isError: Boolean(data.error),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          text: "Network error — please check your connection and try again.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function resetDemo() {
    setMessages([GREETING]);
    setTranscript([]);
    setInput("");
    setLoading(false);
  }

  const showQuickActions = messages.length <= 1;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 sm:px-6">
        <p className="text-xs text-ink/50">
          Demo environment — do not enter real personal or order information.
        </p>
        <button
          type="button"
          onClick={resetDemo}
          className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium text-ink/60 transition-colors hover:border-brand hover:text-brand-dark"
        >
          Reset Demo
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {loading && <TypingIndicator />}
      </div>

      <div className="border-t border-border px-4 py-3 sm:px-6">
        {showQuickActions && (
          <div className="mb-3">
            <QuickActions onSelect={sendMessage} disabled={loading} />
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            rows={1}
            placeholder="Typ uw vraag..."
            className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </form>

        <details className="mt-3 select-none text-xs text-ink/40">
          <summary className="cursor-pointer">Demo info (for presenter)</summary>
          <div className="mt-1.5 space-y-0.5 rounded-lg bg-surface px-3 py-2 font-mono">
            <p>Demo order: VON-2026-10421</p>
            <p>Postcode: 3011AA</p>
          </div>
        </details>
      </div>
    </div>
  );
}
