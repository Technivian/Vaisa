import { describe, it, expect, beforeEach, afterAll } from "vitest";
import {
  createEscalation,
  getEscalations,
  getSimulatedMetrics,
  resetEscalations,
} from "@/lib/escalation";

describe("escalation", () => {
  beforeEach(() => {
    resetEscalations();
  });

  afterAll(() => {
    resetEscalations();
  });

  it("creates an escalation with a unique id, timestamp, and status open", () => {
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
    expect(new Date(escalation.timestamp).toString()).not.toBe("Invalid Date");
  });

  it("lists newly created escalations, most recent first", () => {
    createEscalation({
      reason: "product_defect",
      customerLanguage: "English",
      summary: "First case",
      urgency: "medium",
      recommendedAction: "Warranty assessment.",
      transcript: [],
    });
    createEscalation({
      reason: "refund_dispute",
      customerLanguage: "German",
      summary: "Second case",
      urgency: "low",
      recommendedAction: "Review refund request.",
      transcript: [],
    });

    const escalations = getEscalations();
    expect(escalations).toHaveLength(2);
    expect(escalations[0].summary).toBe("Second case");
  });

  it("moves the escalated and conversation counts when new escalations are created", () => {
    const before = getSimulatedMetrics();
    createEscalation({
      reason: "customer_requested_human",
      customerLanguage: "French",
      summary: "Wants a human agent.",
      urgency: "low",
      recommendedAction: "Route to available agent.",
      transcript: [],
    });
    const after = getSimulatedMetrics();

    expect(after.escalated).toBe(before.escalated + 1);
    expect(after.conversationsToday).toBe(before.conversationsToday + 1);
    expect(after.resolvedByAI).toBe(before.resolvedByAI);
  });
});
