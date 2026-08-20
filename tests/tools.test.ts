import { describe, it, expect, afterEach } from "vitest";
import { executeFunctionTool } from "@/lib/tools";
import { resetEscalations } from "@/lib/escalation";

describe("executeFunctionTool", () => {
  afterEach(() => {
    resetEscalations();
  });

  it("resolves a valid order lookup", async () => {
    const result = await executeFunctionTool(
      "lookup_order",
      JSON.stringify({ orderNumber: "VON-2026-10633", postalCode: "5611EM" }),
      { transcript: [] }
    );
    expect(result.output.found).toBe(true);
  });

  it("reports not found for an invalid order without throwing", async () => {
    const result = await executeFunctionTool(
      "lookup_order",
      JSON.stringify({ orderNumber: "VON-0000-00000", postalCode: "0000ZZ" }),
      { transcript: [] }
    );
    expect(result.output.found).toBe(false);
  });

  it("handles malformed tool arguments gracefully", async () => {
    const result = await executeFunctionTool("lookup_order", "{not valid json", {
      transcript: [],
    });
    expect(result.output.error).toBe(true);
  });

  it("handles missing required arguments gracefully", async () => {
    const result = await executeFunctionTool(
      "lookup_order",
      JSON.stringify({ orderNumber: "VON-2026-10421" }),
      { transcript: [] }
    );
    expect(result.output.error).toBe(true);
  });

  it("creates an escalation and returns its id", async () => {
    const result = await executeFunctionTool(
      "escalate_case",
      JSON.stringify({
        reason: "safety_issue",
        customerLanguage: "Dutch",
        summary: "Smoke reported from a power tool.",
        urgency: "high",
        recommendedAction: "Immediate safety review.",
      }),
      { transcript: [{ role: "customer", content: "Mijn machine begon te roken." }] }
    );
    expect(result.output.created).toBe(true);
    expect(result.escalation?.urgency).toBe("high");
  });

  it("returns an error result for an unknown tool name", async () => {
    const result = await executeFunctionTool("delete_all_orders", "{}", { transcript: [] });
    expect(result.output.error).toBe(true);
  });
});
