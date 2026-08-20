import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createEscalation, type Escalation } from "@/lib/escalation";
import {
  parseStoredEscalations,
  addEscalation,
  loadStoredEscalations,
  saveEscalation,
  clearStoredEscalations,
  ESCALATIONS_STORAGE_KEY,
} from "@/lib/clientEscalations";

function makeEscalation(overrides: Partial<Escalation> = {}): Escalation {
  return {
    ...createEscalation({
      reason: "product_defect",
      customerLanguage: "Dutch",
      summary: "Test summary",
      urgency: "medium",
      recommendedAction: "Test action",
      transcript: [],
    }),
    ...overrides,
  };
}

describe("parseStoredEscalations", () => {
  it("returns an empty array for null/empty input", () => {
    expect(parseStoredEscalations(null)).toEqual([]);
    expect(parseStoredEscalations("")).toEqual([]);
  });

  it("returns an empty array for malformed JSON instead of throwing", () => {
    expect(parseStoredEscalations("{not valid json")).toEqual([]);
  });

  it("returns an empty array when the stored value isn't an array", () => {
    expect(parseStoredEscalations(JSON.stringify({ not: "an array" }))).toEqual([]);
    expect(parseStoredEscalations(JSON.stringify("just a string"))).toEqual([]);
  });

  it("filters out entries missing required fields, keeping valid ones", () => {
    const valid = makeEscalation();
    const raw = JSON.stringify([valid, { id: "ESC-BROKEN" }, null, "garbage", 42]);

    expect(parseStoredEscalations(raw)).toEqual([valid]);
  });

  it("rejects an entry with an invalid urgency value", () => {
    const invalid = { ...makeEscalation(), urgency: "extreme" };
    expect(parseStoredEscalations(JSON.stringify([invalid]))).toEqual([]);
  });
});

describe("addEscalation", () => {
  it("prepends a new escalation (newest first)", () => {
    const first = makeEscalation({ id: "ESC-AAAA1111" });
    const second = makeEscalation({ id: "ESC-BBBB2222" });

    const result = addEscalation([first], second);
    expect(result[0].id).toBe("ESC-BBBB2222");
    expect(result[1].id).toBe("ESC-AAAA1111");
  });

  it("does not add a duplicate id", () => {
    const escalation = makeEscalation({ id: "ESC-SAME0000" });
    const result = addEscalation([escalation], { ...escalation, summary: "A different summary" });
    expect(result).toHaveLength(1);
    expect(result[0].summary).toBe(escalation.summary);
  });

  it("starting from an empty list returns a single-item list", () => {
    const escalation = makeEscalation();
    expect(addEscalation([], escalation)).toEqual([escalation]);
  });
});

describe("browser storage wrappers run safely without a DOM (SSR guard)", () => {
  it("loadStoredEscalations returns [] when window is undefined", () => {
    expect(loadStoredEscalations()).toEqual([]);
  });

  it("saveEscalation does not throw when window is undefined", () => {
    expect(() => saveEscalation(makeEscalation())).not.toThrow();
  });

  it("clearStoredEscalations does not throw when window is undefined", () => {
    expect(() => clearStoredEscalations()).not.toThrow();
  });
});

/** A minimal in-memory localStorage stand-in, so these tests exercise the
 * real read/write path (not just the pure helpers above) without pulling
 * in a full DOM environment like jsdom. */
class FakeLocalStorage {
  private data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

describe("browser storage wrappers with a real (stubbed) localStorage", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: new FakeLocalStorage() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("round-trips a saved escalation through loadStoredEscalations", () => {
    const escalation = makeEscalation({ id: "ESC-ROUND0001" });
    saveEscalation(escalation);
    expect(loadStoredEscalations()).toEqual([escalation]);
  });

  it("does not store the same escalation id twice", () => {
    const escalation = makeEscalation({ id: "ESC-DUPE00001" });
    saveEscalation(escalation);
    saveEscalation({ ...escalation, summary: "Updated but should be ignored" });

    const stored = loadStoredEscalations();
    expect(stored).toHaveLength(1);
    expect(stored[0].summary).toBe(escalation.summary);
  });

  it("keeps newest escalation first across multiple saves", () => {
    const first = makeEscalation({ id: "ESC-ORDER0001" });
    const second = makeEscalation({ id: "ESC-ORDER0002" });
    saveEscalation(first);
    saveEscalation(second);

    const stored = loadStoredEscalations();
    expect(stored.map((e) => e.id)).toEqual(["ESC-ORDER0002", "ESC-ORDER0001"]);
  });

  it("clearStoredEscalations (Reset Demo) empties the store", () => {
    saveEscalation(makeEscalation());
    expect(loadStoredEscalations()).toHaveLength(1);

    clearStoredEscalations();
    expect(loadStoredEscalations()).toEqual([]);
  });

  it("ignores hand-edited malformed content instead of crashing the dashboard", () => {
    (window as unknown as { localStorage: FakeLocalStorage }).localStorage.setItem(
      ESCALATIONS_STORAGE_KEY,
      "{ this is not valid JSON"
    );
    expect(loadStoredEscalations()).toEqual([]);
  });
});
