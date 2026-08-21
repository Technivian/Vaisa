"use client";

import { useEffect } from "react";
import Chat from "@/components/Chat";
import { CloseIcon } from "@/components/ui/icons";

/** Lets a presenter try the live VAISA assistant without leaving the
 * dashboard — same Chat component the customer-facing page uses, so any
 * escalation it creates immediately shows up in Conversations/Overview via
 * the existing localStorage + change-event wiring. Stays mounted while
 * closed (just translated off-screen) so the conversation isn't lost
 * between opens. */
export default function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="VAISA Assistant"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">VAISA Assistant</p>
            <p className="text-xs text-ink-faint">Try it the way a customer would</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
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
