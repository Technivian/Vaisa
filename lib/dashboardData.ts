/**
 * All content in this file is illustrative demo data for the VAISA
 * dashboard — contact-reason mix, language split, and the AI/escalation
 * handling ratio. None of it is derived from real VONROC traffic. It
 * exists purely so the dashboard has something plausible to visualize;
 * see DemoMetrics in lib/escalation.ts for the KPI numbers this data is
 * kept consistent with (conversations sum to 47, resolved trends to 34).
 */

export type AccentToken = "info" | "success" | "brand" | "warning" | "ink";

export interface ContactReason {
  id: string;
  label: string;
  percentage: number;
  accent: AccentToken;
  conversations: number;
  aiResolutionRate: number;
  topIntents: string[];
}

export const CONTACT_REASONS: ContactReason[] = [
  {
    id: "order-delivery",
    label: "Order & delivery",
    percentage: 38,
    accent: "info",
    conversations: 18,
    aiResolutionRate: 89,
    topIntents: ["Order tracking", "Delivery expectation", "Carrier information"],
  },
  {
    id: "returns",
    label: "Returns",
    percentage: 24,
    accent: "brand",
    conversations: 11,
    aiResolutionRate: 75,
    topIntents: ["Return eligibility", "Refund timing", "Exchange policy"],
  },
  {
    id: "product-advice",
    label: "Product advice",
    percentage: 18,
    accent: "success",
    conversations: 9,
    aiResolutionRate: 85,
    topIntents: ["Battery compatibility", "Specifications", "Accessory fit"],
  },
  {
    id: "technical-support",
    label: "Technical support",
    percentage: 13,
    accent: "warning",
    conversations: 6,
    aiResolutionRate: 33,
    topIntents: ["Battery diagnostics", "Overheating", "Safety escalation"],
  },
  {
    id: "warranty",
    label: "Warranty",
    percentage: 7,
    accent: "ink",
    conversations: 3,
    aiResolutionRate: 45,
    topIntents: ["Eligibility check", "Proof of purchase", "Human review"],
  },
];

export const AI_HANDLING = {
  resolvedPercentage: 72,
  escalatedPercentage: 28,
  explanation: "Routine cases are automated. Safety, uncertainty and complex issues are escalated.",
};

/** Short display category for the escalation table/detail, derived from
 * the tool-call `reason` slug (e.g. "safety_issue" -> "Safety"). Falls
 * back to a generic title-cased version of the slug for any reason value
 * not in this list, so it never breaks on a new category the model uses. */
const CATEGORY_LABELS: Record<string, string> = {
  safety_issue: "Safety",
  product_defect: "Technical",
  warranty_dispute: "Warranty",
  refund_dispute: "Returns",
  return_exception: "Returns",
  unresolved_request: "Technical",
  customer_requested_human: "General",
  insufficient_information: "General",
};

export function formatCategory(reason: string): string {
  if (CATEGORY_LABELS[reason]) return CATEGORY_LABELS[reason];
  return reason
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** A short, terse classification line for the handoff panel's default
 * view (e.g. "Potential safety issue") — derived from the same `reason`
 * slug as the category badge, not a separate model-generated field. This
 * is display-only compaction; it never changes what's actually stored. */
const AI_ASSESSMENT_LABELS: Record<string, string> = {
  safety_issue: "Potential safety issue",
  product_defect: "Potential product defect",
  warranty_dispute: "Warranty dispute",
  refund_dispute: "Refund dispute",
  return_exception: "Return exception",
  unresolved_request: "Unresolved technical issue",
  customer_requested_human: "Requested human agent",
  insufficient_information: "Needs more information",
};

export function getAiAssessment(reason: string): string {
  return AI_ASSESSMENT_LABELS[reason] ?? formatCategory(reason);
}

const SHORT_TEXT_MAX_LENGTH = 90;

/** Produces a compact, scannable version of a longer piece of AI-written
 * text (order lookup summaries, recommended actions) for default display
 * — the cases table and the collapsed handoff view. Prefers the first
 * sentence; falls back to a clean word-boundary truncation. This only
 * changes what's rendered, never the underlying stored escalation data —
 * the full text is always still there (e.g. in the transcript). */
export function getShortText(text: string, maxLength: number = SHORT_TEXT_MAX_LENGTH): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;

  const firstSentenceMatch = trimmed.match(/^.*?[.!?](?=\s|$)/);
  if (firstSentenceMatch && firstSentenceMatch[0].length <= maxLength) {
    return firstSentenceMatch[0].trim();
  }

  const truncated = trimmed.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const clipped = lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated;
  return `${clipped.trim()}…`;
}

const LANGUAGE_CODE_BY_NAME: Record<string, string> = {
  dutch: "NL",
  german: "DE",
  french: "FR",
  english: "EN",
};

/** `customerLanguage` is free text from the model (e.g. "Dutch"), not a
 * strict enum. Maps known language names to their short code for compact
 * display (table column, filter matching); falls back to the first two
 * letters, uppercased, for anything unrecognized so it never breaks. */
export function getLanguageCode(customerLanguage: string): string {
  const known = LANGUAGE_CODE_BY_NAME[customerLanguage.trim().toLowerCase()];
  return known ?? customerLanguage.trim().slice(0, 2).toUpperCase();
}
