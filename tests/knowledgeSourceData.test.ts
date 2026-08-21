import { describe, it, expect } from "vitest";
import { KNOWLEDGE_SOURCES, KNOWLEDGE_PRODUCT_COUNT, COVERAGE, KNOWN_SOURCE_CONFLICTS } from "@/lib/knowledgeSourceData";

describe("KNOWLEDGE_SOURCES", () => {
  it("lists ten verified sources", () => {
    expect(KNOWLEDGE_SOURCES).toHaveLength(10);
    expect(KNOWLEDGE_SOURCES.every((s) => s.status === "Verified")).toBe(true);
  });

  it("derives the product count from sources typed Product", () => {
    const productSources = KNOWLEDGE_SOURCES.filter((s) => s.type === "Product");
    expect(productSources).toHaveLength(3);
    expect(KNOWLEDGE_PRODUCT_COUNT).toBe(productSources.length);
  });

  it("never exposes a raw filesystem path in the displayed source field", () => {
    for (const source of KNOWLEDGE_SOURCES) {
      expect(source.source).not.toMatch(/^\/?(knowledge|lib|components|app)\//);
      expect(source.source).not.toMatch(/\.(md|ts|tsx|json)$/);
    }
  });

  it("every source names what it's used for", () => {
    for (const source of KNOWLEDGE_SOURCES) {
      expect(source.usedFor.length).toBeGreaterThan(0);
    }
  });
});

describe("COVERAGE", () => {
  it("marks troubleshooting as limited rather than ready or missing", () => {
    const troubleshooting = COVERAGE.find((row) => row.area === "Troubleshooting");
    expect(troubleshooting?.status).toBe("Limited");
  });

  it("marks every other listed area ready", () => {
    const others = COVERAGE.filter((row) => row.area !== "Troubleshooting");
    expect(others.every((row) => row.status === "Ready")).toBe(true);
  });
});

describe("KNOWN_SOURCE_CONFLICTS", () => {
  it("reports zero conflicts for this demo knowledge base", () => {
    expect(KNOWN_SOURCE_CONFLICTS).toBe(0);
  });
});
