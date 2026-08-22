import { describe, it, expect } from "vitest";
import { SAMPLE_CONVERSATIONS } from "@/lib/conversationData";
import { getKnowledgeLabel } from "@/lib/knowledgeLabels";

describe("getKnowledgeLabel", () => {
  it("maps every known knowledge filename to a human-friendly, commercial label", () => {
    expect(getKnowledgeLabel("troubleshooting.md")).toBe("VONROC Troubleshooting Guide");
    expect(getKnowledgeLabel("returns.md")).toBe("VONROC Returns Policy");
    expect(getKnowledgeLabel("warranty.md")).toBe("VONROC Warranty Policy");
    expect(getKnowledgeLabel("shipping.md")).toBe("VONROC Shipping Information");
    expect(getKnowledgeLabel("batteries.md")).toBe("VONROC Battery Platform Guide");
    expect(getKnowledgeLabel("CD510DC.md")).toBe("CD510DC Product Specifications");
    expect(getKnowledgeLabel("CD511DC.md")).toBe("CD511DC Product Specifications");
    expect(getKnowledgeLabel("RH501DC.md")).toBe("RH501DC Product Specifications");
  });

  it("falls back to a cleaned-up label for an unrecognized filename, never the raw filename", () => {
    const label = getKnowledgeLabel("some_new_file.md");
    expect(label).not.toContain(".md");
    expect(label).not.toContain("_");
  });

  it("every knowledge file actually referenced by sample conversations has a mapped label", () => {
    const filesUsed = new Set(SAMPLE_CONVERSATIONS.flatMap((r) => r.knowledgeUsed.map((k) => k.file)));
    for (const file of filesUsed) {
      expect(getKnowledgeLabel(file)).not.toBe(file);
      expect(getKnowledgeLabel(file)).not.toMatch(/\.md$/i);
    }
  });
});
