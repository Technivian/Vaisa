"use client";

import { useEffect, useRef } from "react";
import Chat from "@/components/Chat";
import { CloseIcon } from "@/components/ui/icons";
import { useLocale } from "@/lib/i18n/LocaleContext";

/** Lets a presenter try the live VAISA assistant without leaving the
 * dashboard — same Chat component the customer-facing page uses, so any
 * escalation it creates immediately shows up in Conversations/Overview via
 * the existing localStorage + change-event wiring. Stays mounted while
 * closed (just translated off-screen) so the conversation isn't lost
 * between opens. A side workspace, not a modal: the dashboard stays
 * visible and interactive behind a light backdrop. */
export default function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // Wait for the open transition to start so focus lands on a visible,
    // interactive element — the chat input if present, otherwise the
    // close button.
    const id = window.setTimeout(() => {
      const input = panelRef.current?.querySelector<HTMLTextAreaElement>("[data-chat-input]");
      const closeButton = panelRef.current?.querySelector<HTMLButtonElement>("[data-close-button]");
      (input ?? closeButton)?.focus();
    }, 50);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-ink/15 transition-opacity duration-200 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${t.assistantPanel.title} — ${t.assistantPanel.subtitle}`}
        className={`absolute right-0 top-0 flex h-full w-full flex-col bg-white shadow-xl transition-transform duration-200 motion-reduce:transition-none sm:max-w-[400px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm font-semibold text-ink">{t.assistantPanel.title}</p>
              <p className="text-xs text-ink-faint">{t.assistantPanel.subtitle}</p>
            </div>
            <span className="rounded-full border border-border bg-surface-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
              {t.assistantPanel.demoBadge}
            </span>
          </div>
          <button
            type="button"
            data-close-button
            onClick={onClose}
            aria-label={t.assistantPanel.closeLabel}
            className="shrink-0 rounded-full p-1.5 text-ink-faint transition-colors duration-150 hover:bg-surface-subtle hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <Chat />
        </div>
      </div>
    </div>
  );
}
