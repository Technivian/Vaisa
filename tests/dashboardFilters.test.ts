import { describe, it, expect } from "vitest";
import { createEscalation } from "@/lib/escalation";
import type { DisplayCase } from "@/lib/dashboardData";
import { filterCases, DEFAULT_CASE_FILTERS } from "@/lib/dashboardFilters";

function makeCase(overrides: Partial<DisplayCase> = {}): DisplayCase {
  return {
    ...createEscalation({
      reason: "product_defect",
      customerLanguage: "Dutch",
      summary: "Drill stops after 10 seconds.",
      urgency: "medium",
      recommendedAction: "Warranty assessment.",
      transcript: [],
    }),
    isSample: false,
    ...overrides,
  };
}

describe("filterCases", () => {
  const high = makeCase({
    id: "ESC-HIGH0001",
    urgency: "high",
    customerLanguage: "Dutch",
    summary: "Drill stops after 10 seconds.",
  });
  const medium = makeCase({
    id: "ESC-MED00001",
    urgency: "medium",
    customerLanguage: "German",
    summary: "Battery charger is not powering on.",
  });
  const low = makeCase({
    id: "ESC-LOW00001",
    urgency: "low",
    customerLanguage: "French",
    status: "resolved",
    summary: "Return exception requested outside the 14-day window.",
    reason: "return_exception",
  });
  const all = [high, medium, low];

  it("returns everything with the default (all/all/all/empty) filters", () => {
    expect(filterCases(all, DEFAULT_CASE_FILTERS)).toEqual(all);
  });

  it("filters by priority", () => {
    const result = filterCases(all, { ...DEFAULT_CASE_FILTERS, priority: "high" });
    expect(result).toEqual([high]);
  });

  it("filters by language, matching known language names to their code", () => {
    const result = filterCases(all, { ...DEFAULT_CASE_FILTERS, language: "DE" });
    expect(result).toEqual([medium]);
  });

  it("filters by status", () => {
    const result = filterCases(all, { ...DEFAULT_CASE_FILTERS, status: "resolved" });
    expect(result).toEqual([low]);
  });

  it("combines multiple filters (AND, not OR)", () => {
    const result = filterCases(all, { ...DEFAULT_CASE_FILTERS, priority: "high", language: "DE" });
    expect(result).toEqual([]);
  });

  it("searches by case id, case-insensitively", () => {
    const result = filterCases(all, { ...DEFAULT_CASE_FILTERS, query: "med00001" });
    expect(result).toEqual([medium]);
  });

  it("searches by summary text", () => {
    const result = filterCases(all, { ...DEFAULT_CASE_FILTERS, query: "14-day" });
    expect(result).toEqual([low]);
  });

  it("searches by category (derived from reason)", () => {
    const result = filterCases(all, { ...DEFAULT_CASE_FILTERS, query: "returns" });
    expect(result).toEqual([low]);
  });

  it("searches by language name", () => {
    const result = filterCases(all, { ...DEFAULT_CASE_FILTERS, query: "german" });
    expect(result).toEqual([medium]);
  });

  it("returns an empty list when nothing matches", () => {
    const result = filterCases(all, { ...DEFAULT_CASE_FILTERS, query: "nonexistent-case-xyz" });
    expect(result).toEqual([]);
  });

  it("trims and ignores case in the search query", () => {
    const result = filterCases(all, { ...DEFAULT_CASE_FILTERS, query: "  DRILL STOPS  " });
    expect(result).toEqual([high]);
  });
});
