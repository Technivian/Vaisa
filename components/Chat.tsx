"use client";

import { useState, useRef, useEffect } from "react";
import Message, { type UIMessage } from "./Message";
import QuickActions from "./QuickActions";
import { saveEscalation, clearStoredEscalations } from "@/lib/clientEscalations";
import type { Escalation } from "@/lib/escalation";
import { useLocale } from "@/lib/i18n/LocaleContext";

type TranscriptItem = Record<string, unknown>;

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
  const { t } = useLocale();
  const [messages, setMessages] = useState<UIMessage[]>(() => [
    { id: "greeting", role: "assistant", text: t.chat.greeting },
  ]);
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

    setMessages((prev) => [
      ...prev,
      { id: newId(), role: "customer", text: trimmed, timestamp: new Date().toISOString() },
    ]);
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
            text: data.error || t.chat.genericError,
            isError: true,
            timestamp: new Date().toISOString(),
          },
        ]);
        return;
      }

      setTranscript(Array.isArray(data.transcript) ? data.transcript : []);

      const escalation: Escalation | undefined = data.escalation;
      if (escalation) {
        saveEscalation(escalation);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          text: data.reply || "...",
          escalationId: escalation?.id,
          isError: Boolean(data.error),
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          text: t.chat.networkError,
          isError: true,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function resetDemo() {
    setMessages([{ id: "greeting", role: "assistant", text: t.chat.greeting }]);
    setTranscript([]);
    setInput("");
    setLoading(false);
    clearStoredEscalations();
  }

  const showQuickActions = messages.length <= 1;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5 sm:px-6">
        <p className="text-xs text-ink/50">{t.chat.disclaimer}</p>
        <button
          type="button"
          onClick={resetDemo}
          className="shrink-0 text-xs font-medium text-ink/40 underline decoration-dotted underline-offset-2 transition-colors hover:text-brand-dark"
        >
          {t.chat.resetDemo}
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex flex-1 flex-col justify-end gap-3 overflow-y-auto px-4 py-4 sm:px-6"
      >
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
            data-chat-input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            rows={1}
            placeholder={t.chat.placeholder}
            className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.chat.send}
          </button>
        </form>

        <details className="mt-3 select-none text-xs text-ink/40">
          <summary className="cursor-pointer">{t.chat.demoInfoLabel}</summary>
          <div className="mt-1.5 space-y-0.5 rounded-lg bg-surface px-3 py-2 font-mono">
            <p>
              {t.chat.demoOrderLabel}: VON-2026-10421
            </p>
            <p>
              {t.chat.postcodeLabel}: 3011AA
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
