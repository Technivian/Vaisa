import type { Urgency } from "@/lib/escalation";

/**
 * Common result shape both providers return to app/api/chat/route.ts.
 * `transcript` is intentionally opaque (provider-specific wire format) —
 * the client only ever echoes it back on the next request, it never reads
 * it, so the two providers can use completely different internal shapes
 * (OpenAI Responses input items vs. Gemini Content turns) without the UI
 * knowing or caring.
 */
export interface ChatResult {
  transcript: unknown[];
  reply: string;
  escalation?: { id: string; urgency: Urgency };
  error?: boolean;
}
