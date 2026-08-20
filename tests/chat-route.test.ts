import { describe, it, expect, vi, beforeEach } from "vitest";

const { createMock, getClientMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  getClientMock: vi.fn(),
}));

vi.mock("@/lib/openai", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/openai")>();
  return {
    ...actual,
    getOpenAIClient: getClientMock,
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

describe("POST /api/chat (AI_PROVIDER=openai)", () => {
  beforeEach(() => {
    process.env.AI_PROVIDER = "openai";
    createMock.mockReset();
    getClientMock.mockReset();
    getClientMock.mockImplementation(() => ({ responses: { create: createMock } }));
  });

  it("resolves an order lookup through a function-call round trip", async () => {
    createMock
      .mockResolvedValueOnce({
        output: [
          {
            type: "function_call",
            name: "lookup_order",
            call_id: "call_1",
            arguments: JSON.stringify({ orderNumber: "VON-2026-10421", postalCode: "3011AA" }),
          },
        ],
        output_text: "",
      })
      .mockResolvedValueOnce({
        output: [
          {
            type: "message",
            role: "assistant",
            status: "completed",
            content: [{ type: "output_text", text: "Your order has shipped via PostNL." }],
          },
        ],
        output_text: "Your order has shipped via PostNL.",
      });

    const res = await POST(
      makeRequest({ transcript: [], message: "VON-2026-10421, postcode 3011AA" })
    );
    const data = await res.json();

    expect(createMock).toHaveBeenCalledTimes(2);
    expect(data.reply).toContain("shipped");
    expect(
      (data.transcript as Array<{ type?: string }>).some(
        (item) => item.type === "function_call_output"
      )
    ).toBe(true);
  });

  it("creates and returns an escalation when the model calls escalate_case", async () => {
    createMock
      .mockResolvedValueOnce({
        output: [
          {
            type: "function_call",
            name: "escalate_case",
            call_id: "call_2",
            arguments: JSON.stringify({
              reason: "safety_issue",
              customerLanguage: "Dutch",
              summary: "Smoke reported from a power tool.",
              urgency: "high",
              recommendedAction: "Immediate safety review.",
            }),
          },
        ],
        output_text: "",
      })
      .mockResolvedValueOnce({
        output: [
          {
            type: "message",
            role: "assistant",
            status: "completed",
            content: [{ type: "output_text", text: "I have passed your case to a colleague." }],
          },
        ],
        output_text: "I have passed your case to a colleague.",
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
    const { MissingApiKeyError } = await import("@/lib/openai");
    getClientMock.mockImplementationOnce(() => {
      throw new MissingApiKeyError();
    });

    const res = await POST(makeRequest({ transcript: [], message: "Hallo" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.reply).toMatch(/OPENAI_API_KEY/);
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
