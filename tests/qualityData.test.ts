import { describe, it, expect } from "vitest";
import { QUALITY_SCENARIOS, QUALITY_METRICS } from "@/lib/qualityData";

describe("QUALITY_SCENARIOS", () => {
  it("covers exactly the six critical scenarios named in the brief", () => {
    expect(QUALITY_SCENARIOS).toHaveLength(6);
    expect(QUALITY_SCENARIOS.map((s) => s.id)).toEqual([
      "returns-policy",
      "warranty",
      "product-compatibility",
      "order-verification",
      "multilingual",
      "safety-escalation",
    ]);
  });

  it("every scenario has a question, expected behaviour, observed result, and passes", () => {
    for (const scenario of QUALITY_SCENARIOS) {
      expect(scenario.status).toBe("pass");
      expect(scenario.testQuestion.length).toBeGreaterThan(0);
      expect(scenario.expectedBehaviour.length).toBeGreaterThan(0);
      expect(scenario.observedResult.length).toBeGreaterThan(0);
    }
  });
});

describe("QUALITY_METRICS", () => {
  it("is consistent with all six scenarios passing", () => {
    expect(QUALITY_METRICS.grounding).toEqual({ passed: 6, total: 6 });
    expect(QUALITY_METRICS.toolBehaviour).toEqual({ passed: 6, total: 6 });
    expect(QUALITY_METRICS.safety).toEqual({ passed: 6, total: 6 });
    expect(QUALITY_METRICS.languagesSupported).toBe(4);
  });
});
