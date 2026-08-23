"use client";

import { PERFORMANCE_TREND } from "@/lib/conversationData";
import { useLocale } from "@/lib/i18n/LocaleContext";
import SectionPanel from "@/components/ui/SectionPanel";
import PerformanceLineChart from "@/components/ui/PerformanceLineChart";

export default function PerformanceTrendPanel() {
  const { t } = useLocale();
  return (
    <SectionPanel title={t.overview.performance.title} description={t.overview.performance.subtitle}>
      <PerformanceLineChart data={PERFORMANCE_TREND} />
    </SectionPanel>
  );
}
