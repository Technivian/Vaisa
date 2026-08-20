import type { ResponseInputItem, ResponseFunctionToolCall } from "openai/resources/responses/responses";
import { getOpenAIClient, getModel, MissingApiKeyError } from "@/lib/openai";
import { buildSystemPrompt } from "@/lib/agentPrompt";
import { buildTools, executeFunctionTool } from "@/lib/tools";
import type { Escalation, TranscriptTurn } from "@/lib/escalation";
import type { ChatResult } from "./types";

const MAX_TOOL_ITERATIONS = 6;

function extractText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text: unknown }).text ?? "");
        }
        return "";
      })
      .join(" ")
      .trim();
  }
  return "";
}

/** Builds a plain customer/assistant transcript from the raw Responses API
 * input items, for use in escalation handoff summaries. Tool call items are
 * intentionally skipped — human staff want the conversation, not the
 * plumbing. */
function buildHumanTranscript(items: ResponseInputItem[]): TranscriptTurn[] {
  const turns: TranscriptTurn[] = [];
  for (const item of items) {
    if (!("role" in item)) continue;
    const itemType = "type" in item ? item.type : undefined;
    if (itemType && itemType !== "message") continue;
    if (item.role === "user") {
      const text = extractText((item as { content: unknown }).content);
      if (text) turns.push({ role: "customer", content: text });
    } else if (item.role === "assistant") {
      const text = extractText((item as { content: unknown }).content);
      if (text) turns.push({ role: "assistant", content: text });
    }
  }
  return turns;
}

export async function runOpenAIChat(
  priorTranscript: unknown[],
  message: string
): Promise<ChatResult> {
  const input: ResponseInputItem[] = [
    ...(priorTranscript as ResponseInputItem[]),
    { role: "user", content: message },
  ];

  let client;
  try {
    client = getOpenAIClient();
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      const demoReply =
        "This demo isn't fully configured yet — the server is missing an OPENAI_API_KEY. Please ask the developer to set it up so I can respond. (This message is shown instead of crashing the app.)";
      input.push({ role: "assistant", content: demoReply });
      return { transcript: input, reply: demoReply };
    }
    throw error;
  }

  const tools = buildTools();
  let escalation: Escalation | undefined;

  try {
    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
      const response = await client.responses.create({
        model: getModel(),
        instructions: buildSystemPrompt(),
        input,
        tools,
      });

      input.push(...(response.output as unknown as ResponseInputItem[]));

      const functionCalls = response.output.filter(
        (item): item is ResponseFunctionToolCall => item.type === "function_call"
      );

      if (functionCalls.length === 0) {
        const reply = response.output_text || "";
        return { transcript: input, reply, escalation };
      }

      for (const call of functionCalls) {
        const result = await executeFunctionTool(call.name, call.arguments, {
          transcript: buildHumanTranscript(input),
        });
        if (result.escalation) escalation = result.escalation;
        input.push({
          type: "function_call_output",
          call_id: call.call_id,
          output: JSON.stringify(result.output),
        });
      }
    }

    const fallback =
      "I'm having trouble completing this automatically — let me pass your case to a colleague.";
    input.push({ role: "assistant", content: fallback });
    return { transcript: input, reply: fallback, escalation };
  } catch (error) {
    console.error("[chat:openai] response generation failed", error);
    const reply =
      "Sorry, something went wrong on our side while generating a response. Please try again in a moment.";
    return { transcript: priorTranscript, reply, error: true };
  }
}
