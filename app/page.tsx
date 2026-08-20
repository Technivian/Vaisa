import Link from "next/link";
import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold tracking-tight">VONROC</span>
              <span className="text-sm font-medium text-white/70">Customer Service</span>
            </div>
            <p className="mt-0.5 text-[11px] text-white/40">
              AI Customer Service Concept Demo — Not an official VONROC system
            </p>
          </div>
          <Link
            href="/dashboard"
            className="hidden shrink-0 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-brand hover:text-white sm:inline-block"
          >
            Employee Dashboard →
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-0 py-0 sm:px-6 sm:py-6">
        <div className="flex flex-1 flex-col overflow-hidden bg-white sm:rounded-2xl sm:border sm:border-border sm:shadow-sm">
          <div className="h-[calc(100vh-72px)] sm:h-[70vh]">
            <Chat />
          </div>
        </div>
      </main>
    </div>
  );
}
