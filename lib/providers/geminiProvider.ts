import type { Content, Part, Tool } from "@google/genai";
import {
  getGeminiClient,
  getGeminiModel,
  getFileSearchStoreName,
  MissingGeminiApiKeyError,
} from "@/lib/gemini";
import { buildSystemPrompt } from "@/lib/agentPrompt";
import { executeFunctionTool } from "@/lib/tools";
import { LOOKUP_ORDER_SCHEMA, ESCALATE_CASE_SCHEMA } from "@/lib/toolSchemas";
import type { Escalation, TranscriptTurn } from "@/lib/escalation";
import type { ChatResult } from "./types";

const MAX_TOOL_ITERATIONS = 6;

function buildGeminiTools(): Tool[] {
  const tools: Tool[] = [
    {
      functionDeclarations: [
        {
          name: LOOKUP_ORDER_SCHEMA.name,
          description: LOOKUP_ORDER_SCHEMA.description,
          parametersJsonSchema: LOOKUP_ORDER_SCHEMA.parameters,
        },
        {
          name: ESCALATE_CASE_SCHEMA.name,
          description: ESCALATE_CASE_SCHEMA.description,
          parametersJsonSchema: ESCALATE_CASE_SCHEMA.parameters,
        },
      ],
    },
  ];
  const fileSearchStoreName = getFileSearchStoreName();
  if (fileSearchStoreName) {
    tools.push({ fileSearch: { fileSearchStoreNames: [fileSearchStoreName] } });
  }
  return tools;
}

function extractText(parts: Part[] | undefined): string {
  if (!parts) return "";
  return parts
    .map((part) => part.text ?? "")
    .join(" ")
    .trim();
}

/** Builds a plain customer/assistant transcript from the raw Gemini content
 * turns, for use in escalation handoff summaries. Turns that carry only a
 * functionCall/functionResponse part (no text) are skipped — human staff
 * want the conversation, not the plumbing. */
function buildHumanTranscript(contents: Content[]): TranscriptTurn[] {
  const turns: TranscriptTurn[] = [];
  for (const content of contents) {
    const text = extractText(content.parts);
    if (!text) continue;
    if (content.role === "user") turns.push({ role: "customer", content: text });
    else if (content.role === "model") turns.push({ role: "assistant", content: text });
  }
  return turns;
}

export async function runGeminiChat(
  priorTranscript: unknown[],
  message: string
): Promise<ChatResult> {
  const contents: Content[] = [
    ...(priorTranscript as Content[]),
    { role: "user", parts: [{ text: message }] },
  ];

  let client;
  try {
    client = getGeminiClient();
  } catch (error) {
    if (error instanceof MissingGeminiApiKeyError) {
      const demoReply =
        "This demo isn't fully configured yet — the server is missing a GEMINI_API_KEY. Please ask the developer to set it up so I can respond. (This message is shown instead of crashing the app.)";
      contents.push({ role: "model", parts: [{ text: demoReply }] });
      return { transcript: contents, reply: demoReply };
    }
    throw error;
  }

  const tools = buildGeminiTools();
  const model = getGeminiModel();
  let escalation: Escalation | undefined;

  try {
    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: buildSystemPrompt(),
          tools,
          // Required by Gemini whenever function declarations are combined
          // with a built-in/server-side tool (here: File Search) in the
          // same request — without it the API rejects the call outright.
          toolConfig: { includeServerSideToolInvocations: true },
        },
      });

      const modelContent = response.candidates?.[0]?.content;
      if (modelContent) contents.push(modelContent);

      const calls = response.functionCalls ?? [];

      if (calls.length === 0) {
        const reply = response.text ?? "";
        return { transcript: contents, reply, escalation };
      }

      const responseParts: Part[] = [];
      for (const call of calls) {
        const name = call.name ?? "";
        const result = await executeFunctionTool(name, JSON.stringify(call.args ?? {}), {
          transcript: buildHumanTranscript(contents),
        });
        if (result.escalation) escalation = result.escalation;
        responseParts.push({
          functionResponse: {
            id: call.id,
            name,
            response: { output: result.output },
          },
        });
      }
      contents.push({ role: "user", parts: responseParts });
    }

    const fallback =
      "I'm having trouble completing this automatically — let me pass your case to a colleague.";
    contents.push({ role: "model", parts: [{ text: fallback }] });
    return { transcript: contents, reply: fallback, escalation };
  } catch (error) {
    console.error("[chat:gemini] response generation failed", error);
    const reply =
      "Sorry, something went wrong on our side while generating a response. Please try again in a moment.";
    return { transcript: priorTranscript, reply, error: true };
  }
}
