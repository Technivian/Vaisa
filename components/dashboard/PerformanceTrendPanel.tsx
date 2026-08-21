import { PERFORMANCE_TREND } from "@/lib/conversationData";
import SectionPanel from "@/components/ui/SectionPanel";
import PerformanceLineChart from "@/components/ui/PerformanceLineChart";

export default function PerformanceTrendPanel() {
  return (
    <SectionPanel title="Performance" description="Simulated demo data — seven day trend">
      <PerformanceLineChart data={PERFORMANCE_TREND} />
    </SectionPanel>
  );
}
