/**
 * Human-friendly labels for knowledge base files — a customer-service
 * employee should never see a raw filename like "CD510DC.md" in the
 * product. Display-only: the underlying filenames used elsewhere
 * (conversation traces, the knowledge base itself) are unchanged.
 */
const KNOWLEDGE_FILE_LABELS: Record<string, string> = {
  "troubleshooting.md": "VONROC Troubleshooting Guide",
  "returns.md": "VONROC Returns Policy",
  "warranty.md": "VONROC Warranty Policy",
  "shipping.md": "VONROC Shipping Information",
  "batteries.md": "VONROC Battery Platform Guide",
  "CD510DC.md": "CD510DC Product Specifications",
  "CD511DC.md": "CD511DC Product Specifications",
  "RH501DC.md": "RH501DC Product Specifications",
};

export function getKnowledgeLabel(file: string): string {
  return KNOWLEDGE_FILE_LABELS[file] ?? file.replace(/\.md$/i, "").replace(/[-_]+/g, " ");
}
