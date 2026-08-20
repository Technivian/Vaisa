import OpenAI from "openai";

export const DEFAULT_MODEL = "gpt-4.1-mini";

export function getModel(): string {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

export function getVectorStoreId(): string | undefined {
  const id = process.env.OPENAI_VECTOR_STORE_ID?.trim();
  return id ? id : undefined;
}

let client: OpenAI | null = null;

/** Throws a descriptive error if OPENAI_API_KEY is missing so callers can
 * surface a graceful demo message instead of crashing. */
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new MissingApiKeyError();
  }
  if (!client) {
    client = new OpenAI({ apiKey });
  }
  return client;
}

export class MissingApiKeyError extends Error {
  constructor() {
    super("OPENAI_API_KEY is not configured.");
    this.name = "MissingApiKeyError";
  }
}
