import Link from "next/link";
import DashboardClient from "@/components/DashboardClient";
import PageHeader from "@/components/ui/PageHeader";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface">
      <PageHeader
        eyebrow="VAISA"
        title="Service Operations"
        subtitle="VONROC AI Service Agent"
        description="Demo analytics — simulated data, not real VONROC performance."
        action={
          <Link
            href="/"
            className="shrink-0 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors duration-150 hover:border-brand hover:text-white"
          >
            Open VAISA Assistant →
          </Link>
        }
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <DashboardClient />
      </main>
    </div>
  );
}
