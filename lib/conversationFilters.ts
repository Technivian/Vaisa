import { getConversationStatus, type ConversationRecord, type ConversationStatus } from "./conversationData";
import { getLanguageCode } from "./dashboardData";

export type OutcomeFilter = "all" | "resolved" | "escalated";
export type LanguageFilter = "all" | "NL" | "DE" | "FR" | "EN";

export interface ConversationFilters {
  outcome: OutcomeFilter;
  language: LanguageFilter;
  topic: string; // "all" or an exact topic string
  query: string;
}

export const DEFAULT_CONVERSATION_FILTERS: ConversationFilters = {
  outcome: "all",
  language: "all",
  topic: "all",
  query: "",
};

const KNOWN_LANGUAGE_FILTERS = new Set<LanguageFilter>(["NL", "DE", "FR", "EN"]);

function languageCodeFor(language: string): LanguageFilter | null {
  const code = getLanguageCode(language);
  return KNOWN_LANGUAGE_FILTERS.has(code as LanguageFilter) ? (code as LanguageFilter) : null;
}

/** Pure client-side filter + search over the conversation list — no
 * API/database involved. */
export function filterConversations(
  records: ConversationRecord[],
  filters: ConversationFilters
): ConversationRecord[] {
  const query = filters.query.trim().toLowerCase();

  return records.filter((r) => {
    if (filters.outcome !== "all" && r.outcome !== filters.outcome) return false;
    if (filters.topic !== "all" && r.topic !== filters.topic) return false;
    if (filters.language !== "all" && languageCodeFor(r.language) !== filters.language) return false;

    if (query) {
      const transcriptText = r.transcript.map((t) => t.content).join(" ");
      const haystack = [r.id, r.topic, r.language, transcriptText].join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

export function uniqueTopics(records: ConversationRecord[]): string[] {
  return Array.from(new Set(records.map((r) => r.topic))).sort();
}

const STATUS_PRIORITY: Record<ConversationStatus, number> = {
  urgent: 0,
  escalated: 1,
  resolved: 2,
};

/** Makes the conversation list read as an operational queue: conversations
 * needing attention float above routine resolved ones, so an employee
 * sees what needs them first. Newest first within each priority tier. */
export function sortConversationsByPriority(records: ConversationRecord[]): ConversationRecord[] {
  return [...records].sort((a, b) => {
    const priorityDiff = STATUS_PRIORITY[getConversationStatus(a)] - STATUS_PRIORITY[getConversationStatus(b)];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}
