import { describe, it, expect } from "vitest";
import { createEscalation } from "@/lib/escalation";
import {
  selectDisplayCases,
  formatCategory,
  getLanguageCode,
  SAMPLE_CASES,
} from "@/lib/dashboardData";

describe("selectDisplayCases", () => {
  it("shows the sample cases when there are no real escalations", () => {
    const result = selectDisplayCases([]);
    expect(result).toBe(SAMPLE_CASES);
    expect(result.every((c) => c.isSample)).toBe(true);
  });

  it("shows only real escalations, never mixed with samples, when any exist", () => {
    const real = createEscalation({
      reason: "safety_issue",
      customerLanguage: "Dutch",
      summary: "Smoke reported.",
      urgency: "high",
      recommendedAction: "Escalate immediately.",
      transcript: [],
    });

    const result = selectDisplayCases([real]);

    expect(result).toHaveLength(1);
    expect(result[0].isSample).toBe(false);
    expect(result[0].id).toBe(real.id);
    expect(result.some((c) => SAMPLE_CASES.some((s) => s.id === c.id))).toBe(false);
  });
});

describe("formatCategory", () => {
  it("maps known reason slugs to a short category label", () => {
    expect(formatCategory("safety_issue")).toBe("Safety");
    expect(formatCategory("warranty_dispute")).toBe("Warranty");
    expect(formatCategory("refund_dispute")).toBe("Returns");
  });

  it("falls back to a title-cased version of an unknown reason", () => {
    expect(formatCategory("some_new_reason")).toBe("Some New Reason");
  });
});

describe("getLanguageCode", () => {
  it("maps known language names to their short code", () => {
    expect(getLanguageCode("Dutch")).toBe("NL");
    expect(getLanguageCode("German")).toBe("DE");
    expect(getLanguageCode("French")).toBe("FR");
    expect(getLanguageCode("English")).toBe("EN");
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(getLanguageCode("  dutch  ")).toBe("NL");
  });

  it("falls back to the first two letters, uppercased, for an unknown language", () => {
    expect(getLanguageCode("Spanish")).toBe("SP");
  });
});
