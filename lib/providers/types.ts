import type { Escalation } from "@/lib/escalation";

/**
 * Common result shape both providers return to app/api/chat/route.ts.
 * `transcript` is intentionally opaque (provider-specific wire format) —
 * the client only ever echoes it back on the next request, it never reads
 * it, so the two providers can use completely different internal shapes
 * (OpenAI Responses input items vs. Gemini Content turns) without the UI
 * knowing or caring.
 *
 * `escalation`, when present, is the full structured record from
 * lib/escalation.ts — the client saves it directly to localStorage, since
 * this app has no server-side escalation store (see lib/clientEscalations.ts).
 */
export interface ChatResult {
  transcript: unknown[];
  reply: string;
  escalation?: Escalation;
  error?: boolean;
}
