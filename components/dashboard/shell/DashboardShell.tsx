"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConversationsIcon } from "@/components/ui/icons";
import { NAV_ITEMS, isActive } from "@/lib/navigation";
import AssistantPanel from "./AssistantPanel";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const desktopTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  function closeAssistant() {
    setAssistantOpen(false);
    // Only the trigger visible at the current breakpoint actually
    // receives focus — focusing a display:none element is a no-op.
    desktopTriggerRef.current?.focus();
    mobileTriggerRef.current?.focus();
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface md:flex-row">
      {/* Desktop sidebar — sticky so it stays in view while main scrolls */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-ink text-white md:flex">
        <div className="px-5 py-5">
          <p className="text-sm font-bold tracking-tight">VAISA</p>
          <p className="text-xs text-white/40">VONROC workspace</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand ${
                  active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.Icon className={`h-[18px] w-[18px] ${active ? "text-brand" : "text-white/40"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-white/10 px-3 py-4">
          <button
            ref={desktopTriggerRef}
            type="button"
            onClick={() => setAssistantOpen(true)}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/85 transition-colors duration-150 hover:border-brand hover:text-white"
          >
            Open VAISA Assistant
            <ConversationsIcon className="h-3.5 w-3.5" />
          </button>
          <div className="px-1 text-[11px] leading-relaxed text-white/35">
            <p className="font-medium text-white/45">Demo environment</p>
            <p>Simulated analytics</p>
            <p className="mt-1.5">Concept demo — not an official VONROC system.</p>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex flex-col bg-ink text-white md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-bold tracking-tight">VAISA</p>
            <p className="text-[11px] text-white/40">VONROC workspace</p>
          </div>
          <button
            ref={mobileTriggerRef}
            type="button"
            onClick={() => setAssistantOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/85 transition-colors duration-150 hover:border-brand hover:text-white"
          >
            Assistant
            <ConversationsIcon className="h-3 w-3" />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                  active ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.Icon className={`h-3.5 w-3.5 ${active ? "text-brand" : "text-white/40"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">{children}</div>
      </main>

      <AssistantPanel open={assistantOpen} onClose={closeAssistant} />
    </div>
  );
}
