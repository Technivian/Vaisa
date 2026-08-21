import { OverviewIcon, ConversationsIcon, QualityIcon, KnowledgeIcon } from "@/components/ui/icons";

export interface NavItem {
  href: string;
  label: string;
  Icon: typeof OverviewIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", Icon: OverviewIcon },
  { href: "/dashboard/conversations", label: "Conversations", Icon: ConversationsIcon },
  { href: "/dashboard/quality", label: "Quality", Icon: QualityIcon },
  { href: "/dashboard/knowledge", label: "Knowledge", Icon: KnowledgeIcon },
];

/** The Overview link (`/dashboard`) only highlights on an exact match —
 * otherwise it would also light up for every nested dashboard route, since
 * they all start with `/dashboard`. Every other nav item highlights on an
 * exact match or any of its sub-routes. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
