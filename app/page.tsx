import Link from "next/link";
import Chat from "@/components/Chat";
import PageHeader from "@/components/ui/PageHeader";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <PageHeader
        eyebrow="VAISA"
        title="VONROC"
        subtitle="Customer Service"
        description="AI Customer Service Concept Demo — Not an official VONROC system"
        action={
          <Link
            href="/dashboard"
            className="hidden shrink-0 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors duration-150 hover:border-brand hover:text-white sm:inline-block"
          >
            Employee Dashboard →
          </Link>
        }
      />

      <main className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col px-0 py-0 sm:px-6 sm:py-6">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white sm:flex-none sm:rounded-2xl sm:border sm:border-border sm:shadow-sm sm:h-[70vh]">
          <Chat />
        </div>
      </main>
    </div>
  );
}
