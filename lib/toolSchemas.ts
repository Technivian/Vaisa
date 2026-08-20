/**
 * Provider-agnostic tool definitions (name, description, JSON Schema
 * parameters). Both the OpenAI Responses API tool builder (lib/tools.ts)
 * and the Gemini function-declaration builder (lib/providers/geminiProvider.ts)
 * read from here, so the two providers can never drift apart on what a
 * tool call actually looks like.
 */

export const LOOKUP_ORDER_SCHEMA = {
  name: "lookup_order",
  description:
    "Look up the status of a VONROC order. Requires BOTH the order number and the postal code of the delivery address to match before any details are returned.",
  parameters: {
    type: "object",
    properties: {
      orderNumber: {
        type: "string",
        description: "The customer's order number, e.g. VON-2026-10421.",
      },
      postalCode: {
        type: "string",
        description: "The postal code of the delivery address, e.g. 3011AA.",
      },
    },
    required: ["orderNumber", "postalCode"],
    additionalProperties: false,
  },
} as const;

export const ESCALATE_CASE_SCHEMA = {
  name: "escalate_case",
  description:
    "Hand off the current case to a human VONROC customer service colleague. Use for safety issues, unresolved technical problems, warranty/refund disputes, unhappy customers, insufficient information, or an explicit request for a human.",
  parameters: {
    type: "object",
    properties: {
      reason: {
        type: "string",
        description:
          "Short machine-readable category, e.g. 'safety_issue', 'product_defect', 'warranty_dispute', 'refund_dispute', 'unresolved_request', 'customer_requested_human', 'insufficient_information'.",
      },
      customerLanguage: {
        type: "string",
        description: "Language the customer has been writing in, e.g. 'Dutch', 'English', 'German', 'French'.",
      },
      summary: {
        type: "string",
        description: "One to three sentence summary of the issue, written in English for internal staff.",
      },
      urgency: {
        type: "string",
        enum: ["low", "medium", "high"],
        description: "Urgency of the case. Use 'high' for any safety issue.",
      },
      recommendedAction: {
        type: "string",
        description: "Short recommended next step for the human colleague, written in English.",
      },
    },
    required: ["reason", "customerLanguage", "summary", "urgency", "recommendedAction"],
    additionalProperties: false,
  },
} as const;
