import { describe, it, expect, vi, beforeEach } from "vitest";

const { createMock, getClientMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  getClientMock: vi.fn(),
}));

vi.mock("@/lib/gemini", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/gemini")>();
  return {
    ...actual,
    getGeminiClient: getClientMock,
  };
});

const { POST } = await import("@/app/api/chat/route");

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

interface TranscriptContent {
  role?: string;
  parts?: Array<{ functionResponse?: unknown; text?: string }>;
}

describe("POST /api/chat (AI_PROVIDER=gemini)", () => {
  beforeEach(() => {
    process.env.AI_PROVIDER = "gemini";
    createMock.mockReset();
    getClientMock.mockReset();
    getClientMock.mockImplementation(() => ({ models: { generateContent: createMock } }));
  });

  it("resolves an order lookup through a function-call round trip", async () => {
    createMock
      .mockResolvedValueOnce({
        candidates: [
          {
            content: {
              role: "model",
              parts: [
                {
                  functionCall: {
                    id: "call_1",
                    name: "lookup_order",
                    args: { orderNumber: "VON-2026-10421", postalCode: "3011AA" },
                  },
                },
              ],
            },
          },
        ],
        functionCalls: [
          {
            id: "call_1",
            name: "lookup_order",
            args: { orderNumber: "VON-2026-10421", postalCode: "3011AA" },
          },
        ],
        text: undefined,
      })
      .mockResolvedValueOnce({
        candidates: [
          {
            content: { role: "model", parts: [{ text: "Your order has shipped via PostNL." }] },
          },
        ],
        functionCalls: [],
        text: "Your order has shipped via PostNL.",
      });

    const res = await POST(
      makeRequest({ transcript: [], message: "VON-2026-10421, postcode 3011AA" })
    );
    const data = await res.json();

    expect(createMock).toHaveBeenCalledTimes(2);
    expect(data.reply).toContain("shipped");
    expect(
      (data.transcript as TranscriptContent[]).some((item) =>
        item.parts?.some((part) => part.functionResponse !== undefined)
      )
    ).toBe(true);
  });

  it("creates and returns an escalation when the model calls escalate_case", async () => {
    createMock
      .mockResolvedValueOnce({
        candidates: [
          {
            content: {
              role: "model",
              parts: [
                {
                  functionCall: {
                    id: "call_2",
                    name: "escalate_case",
                    args: {
                      reason: "safety_issue",
                      customerLanguage: "Dutch",
                      summary: "Smoke reported from a power tool.",
                      urgency: "high",
                      recommendedAction: "Immediate safety review.",
                    },
                  },
                },
              ],
            },
          },
        ],
        functionCalls: [
          {
            id: "call_2",
            name: "escalate_case",
            args: {
              reason: "safety_issue",
              customerLanguage: "Dutch",
              summary: "Smoke reported from a power tool.",
              urgency: "high",
              recommendedAction: "Immediate safety review.",
            },
          },
        ],
        text: undefined,
      })
      .mockResolvedValueOnce({
        candidates: [
          {
            content: {
              role: "model",
              parts: [{ text: "I have passed your case to a colleague." }],
            },
          },
        ],
        functionCalls: [],
        text: "I have passed your case to a colleague.",
      });

    const res = await POST(makeRequest({ transcript: [], message: "Mijn machine begon te roken." }));
    const data = await res.json();

    // The escalation is returned to the client in full (no server-side
    // store on Vercel — the client persists it to localStorage).
    expect(data.escalation).toMatchObject({
      reason: "safety_issue",
      customerLanguage: "Dutch",
      urgency: "high",
      status: "open",
    });
    expect(data.escalation.id).toMatch(/^ESC-/);
    expect(
      data.escalation.transcript.some((t: { content: string }) => t.content.includes("roken"))
    ).toBe(true);
  });

  it("never calls the model for an empty message and returns 400", async () => {
    const res = await POST(makeRequest({ transcript: [], message: "   " }));
    expect(res.status).toBe(400);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("degrades gracefully instead of crashing when the API key is missing", async () => {
    const { MissingGeminiApiKeyError } = await import("@/lib/gemini");
    getClientMock.mockImplementationOnce(() => {
      throw new MissingGeminiApiKeyError();
    });

    const res = await POST(makeRequest({ transcript: [], message: "Hallo" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.reply).toMatch(/GEMINI_API_KEY/);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("returns a friendly error instead of a stack trace when the API call fails", async () => {
    createMock.mockRejectedValueOnce(new Error("upstream network failure"));

    const res = await POST(makeRequest({ transcript: [], message: "Hallo" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.reply).not.toContain("upstream network failure");
    expect(data.error).toBe(true);
  });
});
