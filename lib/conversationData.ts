import type { Escalation, TranscriptTurn, Urgency, EscalationStatus } from "./escalation";
import { getAiAssessment, formatCategory } from "./dashboardData";

/**
 * A single observable step VAISA took during a conversation — intent
 * classification, a knowledge lookup, a tool call, an escalation
 * decision, or the final outcome. This is a demo trace, not the model's
 * chain-of-thought: it only ever names things this app can actually
 * observe (which tool ran, which knowledge file matched, what the
 * escalation tool returned), never internal reasoning.
 */
export interface TraceStep {
  label: string;
  detail: string;
}

export interface KnowledgeUsedItem {
  file: string;
  description: string;
}

export interface ConversationRecord {
  id: string;
  timestamp: string;
  language: string;
  topic: string;
  outcome: "resolved" | "escalated";
  durationSeconds?: number;
  transcript: TranscriptTurn[];
  trace: TraceStep[];
  knowledgeUsed: KnowledgeUsedItem[];
  isSample: boolean;
  // Present only when outcome === "escalated".
  urgency?: Urgency;
  reason?: string;
  summary?: string;
  recommendedAction?: string;
  status?: EscalationStatus;
}

/**
 * Eight illustrative demo conversations covering the topics named in the
 * brief (order tracking, product compatibility, battery compatibility,
 * a German troubleshooting case, a returns question, and three escalation
 * types). Traces and knowledge references are grounded in what this app
 * actually does — the same tools, the same /knowledge files — not
 * invented capability. All clearly marked isSample: true.
 */
export const SAMPLE_CONVERSATIONS: ConversationRecord[] = [
  {
    id: "VA-1041",
    timestamp: "2026-08-20T10:42:00.000Z",
    language: "Dutch",
    topic: "Order tracking",
    outcome: "resolved",
    durationSeconds: 38,
    isSample: true,
    transcript: [
      { role: "customer", content: "Waar is mijn bestelling?" },
      { role: "assistant", content: "Natuurlijk. Wat is uw ordernummer?" },
      { role: "customer", content: "VON-2026-10421" },
      { role: "assistant", content: "Dank u. Wat is de postcode van het afleveradres?" },
      { role: "customer", content: "3011AA" },
      {
        role: "assistant",
        content: "Uw bestelling is onderweg via PostNL en wordt vandaag verwacht.",
      },
    ],
    trace: [
      { label: "Intent detected", detail: "Order tracking" },
      { label: "Information requested", detail: "Order number" },
      { label: "Verification requested", detail: "Postal code" },
      { label: "Tool called", detail: "lookup_order()" },
      { label: "Verification", detail: "Postal code matched" },
      { label: "Outcome", detail: "Order status returned" },
    ],
    knowledgeUsed: [],
  },
  {
    id: "VA-1042",
    timestamp: "2026-08-20T10:35:00.000Z",
    language: "Dutch",
    topic: "Product compatibility",
    outcome: "resolved",
    durationSeconds: 29,
    isSample: true,
    transcript: [
      { role: "customer", content: "Kan ik de CD510DC gebruiken om in beton te boren?" },
      {
        role: "assistant",
        content:
          "Nee, de CD510DC is niet geschikt voor beton. Voor beton raden wij de RH501DC accu-boorhamer aan, die op dezelfde VPower 20V accu werkt.",
      },
    ],
    trace: [
      { label: "Intent detected", detail: "Product compatibility" },
      { label: "Knowledge searched", detail: "CD510DC.md" },
      { label: "Knowledge searched", detail: "RH501DC.md" },
      { label: "Answer grounded", detail: "Product specification found" },
      { label: "Outcome", detail: "Recommendation provided" },
    ],
    knowledgeUsed: [
      { file: "CD510DC.md", description: "Product specifications" },
      { file: "RH501DC.md", description: "Rotary hammer specifications" },
    ],
  },
  {
    id: "VA-1043",
    timestamp: "2026-08-20T10:21:00.000Z",
    language: "Dutch",
    topic: "Battery compatibility",
    outcome: "resolved",
    durationSeconds: 24,
    isSample: true,
    transcript: [
      { role: "customer", content: "Welke accu heb ik nodig voor de RH501DC?" },
      {
        role: "assistant",
        content:
          "De RH501DC werkt op het VPower 20V platform, met een 2.0Ah of 4.0Ah accu.",
      },
    ],
    trace: [
      { label: "Intent detected", detail: "Battery compatibility" },
      { label: "Knowledge searched", detail: "RH501DC.md" },
      { label: "Knowledge searched", detail: "batteries.md" },
      { label: "Answer grounded", detail: "Battery platform confirmed" },
      { label: "Outcome", detail: "Recommendation provided" },
    ],
    knowledgeUsed: [
      { file: "RH501DC.md", description: "Rotary hammer specifications" },
      { file: "batteries.md", description: "Battery platform compatibility" },
    ],
  },
  {
    id: "VA-1044",
    timestamp: "2026-08-20T09:58:00.000Z",
    language: "German",
    topic: "Product troubleshooting",
    outcome: "resolved",
    durationSeconds: 51,
    isSample: true,
    transcript: [
      { role: "customer", content: "Meine Maschine funktioniert nicht mehr." },
      { role: "assistant", content: "Das tut mir leid. Ist der Akku vollständig geladen?" },
      { role: "customer", content: "Ah, das habe ich nicht geprüft. Einen Moment." },
      { role: "customer", content: "Sie hatten recht, der Akku war leer." },
      { role: "assistant", content: "Schön, dass es jetzt funktioniert!" },
    ],
    trace: [
      { label: "Intent detected", detail: "Product troubleshooting" },
      { label: "Knowledge searched", detail: "troubleshooting.md" },
      { label: "Troubleshooting step", detail: "Battery charge checked" },
      { label: "Outcome", detail: "Issue resolved without escalation" },
    ],
    knowledgeUsed: [{ file: "troubleshooting.md", description: "Basic troubleshooting steps" }],
  },
  {
    id: "VA-1045",
    timestamp: "2026-08-20T09:41:00.000Z",
    language: "French",
    topic: "Returns question",
    outcome: "resolved",
    durationSeconds: 19,
    isSample: true,
    transcript: [
      { role: "customer", content: "Je voudrais retourner ma commande." },
      {
        role: "assistant",
        content:
          "Bien sûr. Vous pouvez retourner votre commande dans les 14 jours suivant la réception, à condition qu'elle soit inutilisée et dans son emballage d'origine.",
      },
    ],
    trace: [
      { label: "Intent detected", detail: "Returns policy" },
      { label: "Knowledge searched", detail: "returns.md" },
      { label: "Answer grounded", detail: "Return policy found" },
      { label: "Outcome", detail: "Return procedure explained" },
    ],
    knowledgeUsed: [{ file: "returns.md", description: "Return policy and procedure" }],
  },
  {
    id: "VA-1046",
    timestamp: "2026-08-20T09:15:00.000Z",
    language: "Dutch",
    topic: "Safety issue",
    outcome: "escalated",
    durationSeconds: 33,
    isSample: true,
    urgency: "high",
    reason: "safety_issue",
    summary: "Product emitted smoke during use. Customer asked about self-repair.",
    recommendedAction: "Contact customer, confirm safe shutdown and arrange inspection. No self-repair.",
    status: "open",
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
    trace: [
      { label: "Safety risk detected", detail: "Smoke reported" },
      { label: "Unsafe action blocked", detail: "Customer requested self-repair" },
      { label: "Tool called", detail: "escalate_case()" },
      { label: "Outcome", detail: "Human handoff created" },
    ],
    knowledgeUsed: [],
  },
  {
    id: "VA-1047",
    timestamp: "2026-08-20T08:40:00.000Z",
    language: "German",
    topic: "Warranty dispute",
    outcome: "escalated",
    durationSeconds: 46,
    isSample: true,
    urgency: "medium",
    reason: "warranty_dispute",
    summary: "Drill stopped working after 14 months. Asking about warranty coverage.",
    recommendedAction: "Confirm warranty eligibility and advise on next steps.",
    status: "open",
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
    trace: [
      { label: "Intent detected", detail: "Warranty claim" },
      { label: "Knowledge searched", detail: "warranty.md" },
      { label: "Escalation reason", detail: "Warranty eligibility requires human review" },
      { label: "Tool called", detail: "escalate_case()" },
      { label: "Outcome", detail: "Human handoff created" },
    ],
    knowledgeUsed: [{ file: "warranty.md", description: "Warranty terms and coverage" }],
  },
  {
    id: "VA-1048",
    timestamp: "2026-08-19T15:20:00.000Z",
    language: "French",
    topic: "Return exception",
    outcome: "escalated",
    durationSeconds: 27,
    isSample: true,
    urgency: "low",
    reason: "return_exception",
    summary: "Return requested after the 14-day window closed.",
    recommendedAction: "Assess goodwill exception and respond with return options.",
    status: "open",
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
    trace: [
      { label: "Intent detected", detail: "Return request" },
      { label: "Knowledge searched", detail: "returns.md" },
      { label: "Escalation reason", detail: "Outside standard return window" },
      { label: "Tool called", detail: "escalate_case()" },
      { label: "Outcome", detail: "Human handoff created" },
    ],
    knowledgeUsed: [{ file: "returns.md", description: "Return policy and procedure" }],
  },
];

const RESOLVED_SAMPLES = SAMPLE_CONVERSATIONS.filter((c) => c.outcome === "resolved");
const ESCALATED_SAMPLES = SAMPLE_CONVERSATIONS.filter((c) => c.outcome === "escalated");

/** Builds the honest, observable trace for a REAL escalation — only what
 * we actually captured (the reason, that escalate_case ran, the
 * recommended action), never fabricated intent-detection or
 * knowledge-search steps we have no evidence for. */
function traceForRealEscalation(e: Escalation): TraceStep[] {
  return [
    { label: "Case escalated", detail: formatCategory(e.reason) },
    { label: "Tool called", detail: "escalate_case()" },
    { label: "Outcome", detail: "Human handoff created" },
  ];
}

function escalationToConversationRecord(e: Escalation): ConversationRecord {
  return {
    id: e.id,
    timestamp: e.timestamp,
    language: e.customerLanguage,
    topic: formatCategory(e.reason),
    outcome: "escalated",
    // No real duration is measured for live conversations — omitted
    // rather than fabricated (sample conversations show one because
    // they're explicitly synthetic).
    durationSeconds: undefined,
    transcript: e.transcript,
    trace: traceForRealEscalation(e),
    knowledgeUsed: [],
    isSample: false,
    urgency: e.urgency,
    reason: e.reason,
    summary: e.summary,
    recommendedAction: e.recommendedAction,
    status: e.status,
  };
}

/**
 * The resolved sample conversations always show (there is no live source
 * for them — only escalations are ever persisted). The escalated slot
 * follows the same rule used elsewhere in this app: real escalations,
 * when any exist, fully replace the sample escalations rather than being
 * mixed with them; otherwise the sample escalations show so the page
 * never looks empty. Sorted newest first.
 */
export function selectConversationRecords(realEscalations: Escalation[]): ConversationRecord[] {
  const escalated =
    realEscalations.length > 0
      ? realEscalations.map(escalationToConversationRecord)
      : ESCALATED_SAMPLES;

  return [...RESOLVED_SAMPLES, ...escalated].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getAiAssessmentForRecord(record: ConversationRecord): string {
  if (record.reason) return getAiAssessment(record.reason);
  return record.outcome === "resolved" ? "Resolved without escalation" : "Escalated for review";
}

/** Simulated seven-day performance trend — resolution vs escalation
 * rate. Deterministic demo data, matching the example in the brief. */
export interface TrendPoint {
  label: string;
  resolved: number;
  escalated: number;
}

export const PERFORMANCE_TREND: TrendPoint[] = [
  { label: "Mon", resolved: 63, escalated: 37 },
  { label: "Tue", resolved: 66, escalated: 34 },
  { label: "Wed", resolved: 69, escalated: 31 },
  { label: "Thu", resolved: 68, escalated: 32 },
  { label: "Fri", resolved: 72, escalated: 28 },
  { label: "Sat", resolved: 74, escalated: 26 },
  { label: "Sun", resolved: 72, escalated: 28 },
];
