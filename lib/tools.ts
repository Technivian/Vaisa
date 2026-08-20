import type { Tool } from "openai/resources/responses/responses";
import { getVectorStoreId } from "./openai";
import { lookupOrder } from "./orders";
import { createEscalation, type TranscriptTurn, type Urgency } from "./escalation";
import { LOOKUP_ORDER_SCHEMA, ESCALATE_CASE_SCHEMA } from "./toolSchemas";

const LOOKUP_ORDER_TOOL: Tool = {
  type: "function",
  name: LOOKUP_ORDER_SCHEMA.name,
  description: LOOKUP_ORDER_SCHEMA.description,
  strict: true,
  parameters: LOOKUP_ORDER_SCHEMA.parameters,
};

const ESCALATE_CASE_TOOL: Tool = {
  type: "function",
  name: ESCALATE_CASE_SCHEMA.name,
  description: ESCALATE_CASE_SCHEMA.description,
  strict: true,
  parameters: ESCALATE_CASE_SCHEMA.parameters,
};

export function buildTools(): Tool[] {
  const tools: Tool[] = [LOOKUP_ORDER_TOOL, ESCALATE_CASE_TOOL];
  const vectorStoreId = getVectorStoreId();
  if (vectorStoreId) {
    tools.push({
      type: "file_search",
      vector_store_ids: [vectorStoreId],
    });
  }
  return tools;
}

export interface ToolExecutionContext {
  transcript: TranscriptTurn[];
}

export interface ToolExecutionResult {
  output: Record<string, unknown>;
  escalation?: { id: string; urgency: Urgency };
}

/** Logs demo observability data (tool name, duration, success) without ever
 * logging message content or secrets. */
function logToolCall(name: string, durationMs: number, success: boolean) {
  console.log(
    `[tool] ${name} — ${success ? "success" : "failure"} — ${durationMs.toFixed(0)}ms`
  );
}

export async function executeFunctionTool(
  name: string,
  argumentsJson: string,
  context: ToolExecutionContext
): Promise<ToolExecutionResult> {
  const startedAt = Date.now();
  try {
    const args = argumentsJson ? JSON.parse(argumentsJson) : {};

    if (name === "lookup_order") {
      const { orderNumber, postalCode } = args as {
        orderNumber?: string;
        postalCode?: string;
      };
      if (!orderNumber || !postalCode) {
        throw new Error("Missing orderNumber or postalCode");
      }
      const result = lookupOrder(orderNumber, postalCode);
      logToolCall(name, Date.now() - startedAt, true);
      return { output: result as unknown as Record<string, unknown> };
    }

    if (name === "escalate_case") {
      const { reason, customerLanguage, summary, urgency, recommendedAction } = args as {
        reason?: string;
        customerLanguage?: string;
        summary?: string;
        urgency?: Urgency;
        recommendedAction?: string;
      };
      if (!reason || !customerLanguage || !summary || !urgency || !recommendedAction) {
        throw new Error("Missing required escalation fields");
      }
      const escalation = createEscalation({
        reason,
        customerLanguage,
        summary,
        urgency,
        recommendedAction,
        transcript: context.transcript,
      });
      logToolCall(name, Date.now() - startedAt, true);
      console.log(`[escalation] created ${escalation.id} — urgency=${escalation.urgency}`);
      return {
        output: { created: true, escalationId: escalation.id, status: escalation.status },
        escalation: { id: escalation.id, urgency: escalation.urgency },
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    logToolCall(name, Date.now() - startedAt, false);
    return {
      output: {
        error: true,
        message: error instanceof Error ? error.message : "Tool execution failed",
      },
    };
  }
}
