import type { Escalation } from "./escalation";

/** Decides what the dashboard's case queue should actually display: real,
 * browser-persisted escalations when any exist, or the illustrative
 * SAMPLE_CASES when the list is empty — never a mix of the two, so a real
 * escalation always fully and unambiguously replaces the samples. Pure —
 * easy to test without rendering anything. */
export function selectDisplayCases(realEscalations: Escalation[]): DisplayCase[] {
  if (realEscalations.length > 0) {
    return realEscalations.map((e) => ({ ...e, isSample: false }));
  }
  return SAMPLE_CASES;
}

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
  note: string;
}

export const CONTACT_REASONS: ContactReason[] = [
  {
    id: "order-delivery",
    label: "Order & delivery",
    percentage: 38,
    accent: "info",
    conversations: 18,
    aiResolutionRate: 89,
    note: "Primary intents: order tracking, delivery expectation, carrier information.",
  },
  {
    id: "returns",
    label: "Returns",
    percentage: 24,
    accent: "brand",
    conversations: 11,
    aiResolutionRate: 75,
    note: "Primary intents: return eligibility, refund timing, exchange policy.",
  },
  {
    id: "product-advice",
    label: "Product advice",
    percentage: 18,
    accent: "success",
    conversations: 9,
    aiResolutionRate: 85,
    note: "Primary intents: battery compatibility, product specifications, accessory fit.",
  },
  {
    id: "technical-support",
    label: "Technical support",
    percentage: 13,
    accent: "warning",
    conversations: 6,
    aiResolutionRate: 33,
    note: "Most complex cases are escalated when safety or product defects are involved.",
  },
  {
    id: "warranty",
    label: "Warranty",
    percentage: 7,
    accent: "ink",
    conversations: 3,
    aiResolutionRate: 45,
    note: "Warranty eligibility is confirmed by a human colleague, not VAISA — most contacts are reviewed manually.",
  },
];

export interface LanguageShare {
  code: string;
  label: string;
  percentage: number;
}

export const LANGUAGE_SHARE: LanguageShare[] = [
  { code: "NL", label: "Dutch", percentage: 61 },
  { code: "DE", label: "German", percentage: 18 },
  { code: "FR", label: "French", percentage: 12 },
  { code: "EN", label: "English", percentage: 9 },
];

export const AI_HANDLING = {
  resolvedPercentage: 72,
  escalatedPercentage: 28,
  explanation:
    "VAISA attempts to resolve routine, well-grounded questions automatically. Cases involving uncertainty, safety, disputes or complex technical issues are escalated.",
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

/** A dashboard-displayable case — either a real, browser-persisted
 * escalation, or one of the illustrative SAMPLE_CASES below. Sample cases
 * are visually and structurally identical to real ones (same detail panel,
 * same table row) but always carry `isSample: true` so they can never be
 * mistaken for genuine demo activity, and are never written to
 * localStorage. */
export type DisplayCase = Escalation & { isSample: boolean };

export const SAMPLE_CASES: DisplayCase[] = [
  {
    id: "ESC-SAMPLE-01",
    timestamp: "2026-08-20T07:15:00.000Z",
    reason: "safety_issue",
    customerLanguage: "Dutch",
    summary: "Product emitted smoke while in use; customer asked whether they could open the housing themselves.",
    urgency: "high",
    recommendedAction:
      "Contact the customer immediately, confirm the device is unplugged and the battery removed, and arrange an inspection. Do not authorize self-repair.",
    status: "open",
    isSample: true,
    transcript: [
      { role: "customer", content: "Mijn machine begon te roken tijdens het gebruik." },
      {
        role: "assistant",
        content:
          "Stop onmiddellijk met het gebruiken van de machine en verwijder de accu als dat veilig is. Maak het apparaat niet zelf open.",
      },
      { role: "customer", content: "Oké, mag ik hem zelf openmaken om te kijken wat er mis is?" },
      {
        role: "assistant",
        content:
          "Nee, dat raad ik af — dit kan gevaarlijk zijn en uw garantie beïnvloeden. Ik zet dit met hoge prioriteit door naar een collega.",
      },
    ],
  },
  {
    id: "ESC-SAMPLE-02",
    timestamp: "2026-08-20T06:40:00.000Z",
    reason: "warranty_dispute",
    customerLanguage: "German",
    summary:
      "Customer's cordless drill stopped working after 14 months; asking whether it's covered under warranty and wants an assessment.",
    urgency: "medium",
    recommendedAction:
      "Review purchase date and registration status, confirm warranty eligibility, and advise the customer on next steps.",
    status: "open",
    isSample: true,
    transcript: [
      { role: "customer", content: "Meine Bohrmaschine funktioniert nach 14 Monaten nicht mehr." },
      {
        role: "assistant",
        content:
          "Das tut mir leid zu hören. Haben Sie das Produkt registriert, und haben Sie den Kaufbeleg zur Hand?",
      },
      { role: "customer", content: "Ja, ich habe die Rechnung noch." },
      {
        role: "assistant",
        content:
          "Danke. Ich leite dies an einen Kollegen weiter, der die Garantieberechtigung prüfen kann.",
      },
    ],
  },
  {
    id: "ESC-SAMPLE-03",
    timestamp: "2026-08-19T15:20:00.000Z",
    reason: "return_exception",
    customerLanguage: "French",
    summary:
      "Customer wants to return a product after the standard 14-day window closed; asking whether an exception is possible.",
    urgency: "low",
    recommendedAction:
      "Assess whether a goodwill exception applies and respond with available return options.",
    status: "open",
    isSample: true,
    transcript: [
      {
        role: "customer",
        content: "Je voudrais retourner un produit, mais le délai de 14 jours est dépassé de quelques jours.",
      },
      {
        role: "assistant",
        content:
          "Je comprends. Le délai standard est de 14 jours, mais je transmets votre demande à un collègue qui pourra évaluer une exception.",
      },
    ],
  },
];
