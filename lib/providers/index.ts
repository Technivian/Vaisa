export type AIProviderName = "openai" | "gemini";

/**
 * Selects which AI backend powers the chat route. Defaults to "gemini" for
 * this demo/dev environment (set explicitly here rather than relying on
 * the env var being present) — flip to "openai" via AI_PROVIDER=openai
 * once the OpenAI account has credits again. Both implementations share
 * the same business logic (lib/orders.ts, lib/escalation.ts, lib/tools.ts)
 * and tool schemas (lib/toolSchemas.ts); only the model-calling loop
 * differs.
 */
export function getActiveProvider(): AIProviderName {
  const raw = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (raw === "openai") return "openai";
  if (raw === "gemini") return "gemini";
  return "gemini";
}

export type { ChatResult } from "./types";
export { runOpenAIChat } from "./openaiProvider";
export { runGeminiChat } from "./geminiProvider";
