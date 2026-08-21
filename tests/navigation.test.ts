import { describe, it, expect } from "vitest";
import { NAV_ITEMS, isActive } from "@/lib/navigation";

describe("NAV_ITEMS", () => {
  it("lists exactly the four dashboard sections in order", () => {
    expect(NAV_ITEMS.map((item) => item.href)).toEqual([
      "/dashboard",
      "/dashboard/conversations",
      "/dashboard/quality",
      "/dashboard/knowledge",
    ]);
  });
});

describe("isActive", () => {
  it("highlights Overview only on an exact match", () => {
    expect(isActive("/dashboard", "/dashboard")).toBe(true);
    expect(isActive("/dashboard/conversations", "/dashboard")).toBe(false);
    expect(isActive("/dashboard/quality", "/dashboard")).toBe(false);
  });

  it("highlights a nav item on an exact match", () => {
    expect(isActive("/dashboard/conversations", "/dashboard/conversations")).toBe(true);
    expect(isActive("/dashboard/quality", "/dashboard/quality")).toBe(true);
  });

  it("highlights a nav item on a nested sub-route", () => {
    expect(isActive("/dashboard/conversations/VA-1041", "/dashboard/conversations")).toBe(true);
    expect(isActive("/dashboard/conversationsx", "/dashboard/conversations")).toBe(false);
  });

  it("does not cross-highlight unrelated nav items", () => {
    expect(isActive("/dashboard/knowledge", "/dashboard/quality")).toBe(false);
    expect(isActive("/dashboard/quality", "/dashboard/conversations")).toBe(false);
  });
});
