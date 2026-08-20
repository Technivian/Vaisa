import Link from "next/link";
import DashboardClient from "@/components/DashboardClient";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold tracking-tight">VONROC</span>
              <span className="text-sm font-medium text-white/70">Customer Service Dashboard</span>
            </div>
            <p className="mt-0.5 text-[11px] text-white/40">
              Demo / simulated analytics — not real VONROC data
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-brand hover:text-white"
          >
            ← Back to chat
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <DashboardClient />
      </main>
    </div>
  );
}
