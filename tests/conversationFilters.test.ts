import { describe, it, expect } from "vitest";
import { SAMPLE_CONVERSATIONS } from "@/lib/conversationData";
import { filterConversations, uniqueTopics, DEFAULT_CONVERSATION_FILTERS } from "@/lib/conversationFilters";

describe("filterConversations", () => {
  it("returns everything with the default filters", () => {
    expect(filterConversations(SAMPLE_CONVERSATIONS, DEFAULT_CONVERSATION_FILTERS)).toEqual(
      SAMPLE_CONVERSATIONS
    );
  });

  it("filters by outcome", () => {
    const result = filterConversations(SAMPLE_CONVERSATIONS, {
      ...DEFAULT_CONVERSATION_FILTERS,
      outcome: "escalated",
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((r) => r.outcome === "escalated")).toBe(true);
  });

  it("filters by language, matching known language names to their code", () => {
    const result = filterConversations(SAMPLE_CONVERSATIONS, {
      ...DEFAULT_CONVERSATION_FILTERS,
      language: "DE",
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((r) => r.language === "German")).toBe(true);
  });

  it("filters by topic", () => {
    const result = filterConversations(SAMPLE_CONVERSATIONS, {
      ...DEFAULT_CONVERSATION_FILTERS,
      topic: "Order tracking",
    });
    expect(result).toHaveLength(1);
    expect(result[0].topic).toBe("Order tracking");
  });

  it("combines multiple filters (AND, not OR)", () => {
    const result = filterConversations(SAMPLE_CONVERSATIONS, {
      ...DEFAULT_CONVERSATION_FILTERS,
      outcome: "resolved",
      language: "DE",
    });
    expect(result.every((r) => r.outcome === "resolved" && r.language === "German")).toBe(true);
  });

  it("searches by conversation id, case-insensitively", () => {
    const result = filterConversations(SAMPLE_CONVERSATIONS, {
      ...DEFAULT_CONVERSATION_FILTERS,
      query: "va-1041",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("VA-1041");
  });

  it("searches transcript text", () => {
    const result = filterConversations(SAMPLE_CONVERSATIONS, {
      ...DEFAULT_CONVERSATION_FILTERS,
      query: "CD510DC",
    });
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns an empty list when nothing matches", () => {
    const result = filterConversations(SAMPLE_CONVERSATIONS, {
      ...DEFAULT_CONVERSATION_FILTERS,
      query: "nonexistent-topic-xyz",
    });
    expect(result).toEqual([]);
  });
});

describe("uniqueTopics", () => {
  it("returns a sorted, de-duplicated list of topics", () => {
    const topics = uniqueTopics(SAMPLE_CONVERSATIONS);
    expect(topics).toEqual([...new Set(topics)].sort());
    expect(topics).toContain("Order tracking");
  });
});
