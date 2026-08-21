import { describe, it, expect } from "vitest";
import { formatCategory, getAiAssessment, getLanguageCode, getShortText } from "@/lib/dashboardData";

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

describe("getAiAssessment", () => {
  it("maps known reason slugs to a short assessment line", () => {
    expect(getAiAssessment("safety_issue")).toBe("Potential safety issue");
    expect(getAiAssessment("warranty_dispute")).toBe("Warranty dispute");
  });

  it("falls back to the formatted category for an unknown reason", () => {
    expect(getAiAssessment("some_new_reason")).toBe(formatCategory("some_new_reason"));
  });
});

describe("getShortText", () => {
  it("returns short text unchanged", () => {
    expect(getShortText("Short and sweet.")).toBe("Short and sweet.");
  });

  it("prefers the first sentence when it fits within the max length", () => {
    const text =
      "Product emitted smoke while in use. Customer asked whether they could open the housing themselves and inspect it.";
    expect(getShortText(text)).toBe("Product emitted smoke while in use.");
  });

  it("falls back to a word-boundary truncation with an ellipsis when no early sentence break exists", () => {
    const text =
      "This is a single very long run-on sentence that keeps going and going without any punctuation to break it up at all whatsoever";
    const result = getShortText(text, 50);
    expect(result.length).toBeLessThanOrEqual(51);
    expect(result.endsWith("…")).toBe(true);
    expect(result.endsWith(" …")).toBe(false);
  });

  it("never changes text that is already within the limit, even with multiple sentences", () => {
    const text = "Short. Still short.";
    expect(getShortText(text, 90)).toBe(text);
  });
});
