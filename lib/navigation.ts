import { OverviewIcon, ConversationsIcon, QualityIcon, KnowledgeIcon } from "@/components/ui/icons";

export interface NavItem {
  href: string;
  /** Key into `t.shell.nav` — labels are translated, not hardcoded here. */
  key: "overview" | "conversations" | "quality" | "knowledge";
  Icon: typeof OverviewIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", key: "overview", Icon: OverviewIcon },
  { href: "/dashboard/conversations", key: "conversations", Icon: ConversationsIcon },
  { href: "/dashboard/quality", key: "quality", Icon: QualityIcon },
  { href: "/dashboard/knowledge", key: "knowledge", Icon: KnowledgeIcon },
];

/** The Overview link (`/dashboard`) only highlights on an exact match —
 * otherwise it would also light up for every nested dashboard route, since
 * they all start with `/dashboard`. Every other nav item highlights on an
 * exact match or any of its sub-routes. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
