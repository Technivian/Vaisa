/**
 * Describes the actual contents of /knowledge, the File Search knowledge
 * base VAISA grounds its answers in. Counts (10 sources, 3 products) are
 * derived from what's really in that folder, not invented — see
 * knowledge/README.md. Key facts for each product are taken directly from
 * their knowledge files (knowledge/products/*.md), not fabricated.
 */

export type SourceType = "Policy" | "Product" | "Reference";

export interface KnowledgeSource {
  id: string;
  name: string;
  type: SourceType;
  status: "Verified";
  source: string;
  coverage: string;
  lastRetrieved: string;
  usedFor: string[];
  keyFacts?: string[];
}

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    id: "returns",
    name: "Returns",
    type: "Policy",
    status: "Verified",
    source: "vonroc.nl/retourneren",
    coverage: "Returns",
    lastRetrieved: "2026-08-20",
    usedFor: ["Return eligibility", "Refund timing", "Exchange policy"],
  },
  {
    id: "shipping",
    name: "Shipping",
    type: "Policy",
    status: "Verified",
    source: "vonroc.nl/verzenden",
    coverage: "Orders",
    lastRetrieved: "2026-08-20",
    usedFor: ["Delivery timelines", "Carriers", "Shipping costs"],
  },
  {
    id: "warranty",
    name: "Warranty",
    type: "Policy",
    status: "Verified",
    source: "VONROC + Algemene Voorwaarden",
    coverage: "Warranty",
    lastRetrieved: "2026-08-20",
    usedFor: ["Warranty length", "What voids a warranty", "Claim process"],
  },
  {
    id: "product-registration",
    name: "Product registration",
    type: "Policy",
    status: "Verified",
    source: "vonroc.nl/productregistratie",
    coverage: "Warranty",
    lastRetrieved: "2026-08-20",
    usedFor: ["Extended warranty eligibility", "Registration steps"],
  },
  {
    id: "batteries",
    name: "Batteries",
    type: "Reference",
    status: "Verified",
    source: "VONROC VPower 20V product pages",
    coverage: "Product advice",
    lastRetrieved: "2026-08-20",
    usedFor: ["Battery platform compatibility", "12V vs 20V"],
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    type: "Reference",
    status: "Verified",
    source: "VONROC product manuals (3 products)",
    coverage: "Troubleshooting",
    lastRetrieved: "2026-08-20",
    usedFor: ["Basic diagnostics", "Safety-related symptoms"],
  },
  {
    id: "contact",
    name: "Contact",
    type: "Policy",
    status: "Verified",
    source: "vonroc.nl/contactnew",
    coverage: "Contact information",
    lastRetrieved: "2026-08-20",
    usedFor: ["Human support hours", "Escalation channels"],
  },
  {
    id: "cd510dc",
    name: "CD510DC",
    type: "Product",
    status: "Verified",
    source: "VONROC product specifications",
    coverage: "Product advice",
    lastRetrieved: "2026-08-20",
    usedFor: ["Product compatibility", "Battery questions", "Drilling capability"],
    keyFacts: ["20V", "20 mm wood", "6 mm metal", "Not suitable for concrete"],
  },
  {
    id: "cd511dc",
    name: "CD511DC",
    type: "Product",
    status: "Verified",
    source: "VONROC product specifications",
    coverage: "Product advice",
    lastRetrieved: "2026-08-20",
    usedFor: ["Product compatibility", "Battery questions", "Drilling capability"],
    keyFacts: ["20V", "Brushless", "35 mm wood", "10 mm metal", "Not suitable for concrete"],
  },
  {
    id: "rh501dc",
    name: "RH501DC",
    type: "Product",
    status: "Verified",
    source: "VONROC product specifications",
    coverage: "Product advice",
    lastRetrieved: "2026-08-20",
    usedFor: ["Product compatibility", "Battery questions", "Concrete drilling"],
    keyFacts: ["20V", "SDS-plus", "10 mm concrete", "8 mm metal", "16 mm wood"],
  },
];

export const KNOWLEDGE_PRODUCT_COUNT = KNOWLEDGE_SOURCES.filter((s) => s.type === "Product").length;

export interface CoverageRow {
  area: string;
  status: "Ready" | "Limited";
}

export const COVERAGE: CoverageRow[] = [
  { area: "Orders", status: "Ready" },
  { area: "Returns", status: "Ready" },
  { area: "Warranty", status: "Ready" },
  { area: "Product advice", status: "Ready" },
  { area: "Troubleshooting", status: "Limited" },
  { area: "Contact information", status: "Ready" },
];

export const KNOWN_SOURCE_CONFLICTS = 0;
