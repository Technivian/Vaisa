import { describe, it, expect } from "vitest";
import { createEscalation } from "@/lib/escalation";
import { SAMPLE_CONVERSATIONS, selectConversationRecords, getAiAssessmentForRecord } from "@/lib/conversationData";

describe("selectConversationRecords", () => {
  it("shows the sample escalations alongside sample resolved conversations when no real escalations exist", () => {
    const result = selectConversationRecords([]);
    expect(result.every((r) => r.isSample)).toBe(true);
    expect(result.some((r) => r.outcome === "resolved")).toBe(true);
    expect(result.some((r) => r.outcome === "escalated")).toBe(true);
  });

  it("replaces sample escalations with real ones, never mixing the two, when any real escalation exists", () => {
    const real = createEscalation({
      reason: "safety_issue",
      customerLanguage: "Dutch",
      summary: "Smoke reported.",
      urgency: "high",
      recommendedAction: "Escalate immediately.",
      transcript: [],
    });

    const result = selectConversationRecords([real]);
    const escalated = result.filter((r) => r.outcome === "escalated");
    const resolved = result.filter((r) => r.outcome === "resolved");

    expect(escalated).toHaveLength(1);
    expect(escalated[0].id).toBe(real.id);
    expect(escalated[0].isSample).toBe(false);
    // The sample resolved conversations still show — there is no live
    // source for non-escalated conversations.
    expect(resolved.length).toBeGreaterThan(0);
    expect(resolved.every((r) => r.isSample)).toBe(true);
  });

  it("sorts records newest first", () => {
    const result = selectConversationRecords([]);
    const timestamps = result.map((r) => new Date(r.timestamp).getTime());
    const sorted = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sorted);
  });
});

describe("conversation traces never leak hidden reasoning", () => {
  const FORBIDDEN_PATTERNS = [/chain.of.thought/i, /reasoning/i, /internal thought/i, /let me think/i];

  it("every sample conversation's trace only names observable actions", () => {
    for (const record of SAMPLE_CONVERSATIONS) {
      expect(record.trace.length).toBeGreaterThan(0);
      for (const step of record.trace) {
        const text = `${step.label} ${step.detail}`;
        for (const pattern of FORBIDDEN_PATTERNS) {
          expect(text).not.toMatch(pattern);
        }
      }
    }
  });

  it("a real escalation's trace only reports what was actually captured", () => {
    const real = createEscalation({
      reason: "warranty_dispute",
      customerLanguage: "German",
      summary: "Drill broke.",
      urgency: "medium",
      recommendedAction: "Confirm warranty eligibility.",
      transcript: [],
    });
    const escalatedRecord = selectConversationRecords([real]).find((r) => r.id === real.id)!;

    expect(escalatedRecord.trace.map((s) => s.label)).toEqual(["Case escalated", "Tool called", "Outcome"]);
    // No fabricated intent-detection or knowledge-search steps for a real
    // conversation we didn't actually observe those steps for.
    expect(escalatedRecord.trace.some((s) => s.label.toLowerCase().includes("knowledge"))).toBe(false);
  });
});

describe("getAiAssessmentForRecord", () => {
  it("returns a short assessment for escalated records", () => {
    const escalated = SAMPLE_CONVERSATIONS.find((r) => r.outcome === "escalated")!;
    expect(getAiAssessmentForRecord(escalated)).toBe("Potential safety issue");
  });

  it("returns a resolved message for resolved records", () => {
    const resolved = SAMPLE_CONVERSATIONS.find((r) => r.outcome === "resolved")!;
    expect(getAiAssessmentForRecord(resolved)).toBe("Resolved without escalation");
  });
});
