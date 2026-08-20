import { GoogleGenAI } from "@google/genai";

export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash";

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

/** Resource name of a Gemini File Search store, e.g. "fileSearchStores/abc123". */
export function getFileSearchStoreName(): string | undefined {
  const name = process.env.GEMINI_FILE_SEARCH_STORE_NAME?.trim();
  return name ? name : undefined;
}

let client: GoogleGenAI | null = null;

/** Throws a descriptive error if GEMINI_API_KEY is missing so callers can
 * surface a graceful demo message instead of crashing. */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new MissingGeminiApiKeyError();
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export class MissingGeminiApiKeyError extends Error {
  constructor() {
    super("GEMINI_API_KEY is not configured.");
    this.name = "MissingGeminiApiKeyError";
  }
}
