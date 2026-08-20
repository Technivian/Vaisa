import { describe, it, expect } from "vitest";
import { createEscalation, getSimulatedMetrics } from "@/lib/escalation";

describe("createEscalation", () => {
  it("builds a structured escalation with a unique id, timestamp, and status open", () => {
    const escalation = createEscalation({
      reason: "safety_issue",
      customerLanguage: "Dutch",
      summary: "Customer reported smoke from a cordless drill.",
      urgency: "high",
      recommendedAction: "Immediate safety assessment.",
      transcript: [{ role: "customer", content: "Mijn machine begon te roken." }],
    });

    expect(escalation.id).toMatch(/^ESC-/);
    expect(escalation.status).toBe("open");
    expect(escalation.urgency).toBe("high");
    expect(escalation.customerLanguage).toBe("Dutch");
    expect(new Date(escalation.timestamp).toString()).not.toBe("Invalid Date");
  });

  it("generates a different id for every escalation, even with identical input", () => {
    const input = {
      reason: "product_defect",
      customerLanguage: "English",
      summary: "Same issue.",
      urgency: "medium" as const,
      recommendedAction: "Warranty assessment.",
      transcript: [],
    };
    const a = createEscalation(input);
    const b = createEscalation(input);
    expect(a.id).not.toBe(b.id);
  });

  it("has a stable, round-trippable shape (JSON serialization)", () => {
    const escalation = createEscalation({
      reason: "refund_dispute",
      customerLanguage: "French",
      summary: "Wants a refund.",
      urgency: "low",
      recommendedAction: "Review refund request.",
      transcript: [
        { role: "customer", content: "Bonjour" },
        { role: "assistant", content: "Bonjour, comment puis-je vous aider ?" },
      ],
    });

    const roundTripped = JSON.parse(JSON.stringify(escalation));
    expect(roundTripped).toEqual(escalation);
    expect(Object.keys(roundTripped).sort()).toEqual(
      [
        "id",
        "timestamp",
        "reason",
        "customerLanguage",
        "summary",
        "urgency",
        "recommendedAction",
        "transcript",
        "status",
      ].sort()
    );
  });

  it("never touches the filesystem — pure construction only", () => {
    // If this accidentally depended on fs, requiring the module would be
    // fine but calling it in a read-only environment (like a Vercel
    // serverless function) would throw. Calling it many times here with
    // no fs mocks in place is the regression guard for that.
    for (let i = 0; i < 5; i++) {
      expect(() =>
        createEscalation({
          reason: "unresolved_request",
          customerLanguage: "German",
          summary: "Test",
          urgency: "low",
          recommendedAction: "Test",
          transcript: [],
        })
      ).not.toThrow();
    }
  });
});

describe("getSimulatedMetrics", () => {
  it("returns the fixed baseline when there are no live escalations", () => {
    const metrics = getSimulatedMetrics(0);
    expect(metrics).toEqual({
      conversationsToday: 47,
      resolvedByAI: 34,
      escalated: 13,
      automationRate: 72,
      avgResponseTimeSeconds: 2.1,
    });
  });

  it("moves the escalated and conversation counts with the live escalation count", () => {
    const before = getSimulatedMetrics(0);
    const after = getSimulatedMetrics(3);

    expect(after.escalated).toBe(before.escalated + 3);
    expect(after.conversationsToday).toBe(before.conversationsToday + 3);
    expect(after.resolvedByAI).toBe(before.resolvedByAI);
  });

  it("is a pure function — same input always gives the same output", () => {
    expect(getSimulatedMetrics(5)).toEqual(getSimulatedMetrics(5));
  });
});
