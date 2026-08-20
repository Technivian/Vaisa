import { describe, it, expect } from "vitest";
import { lookupOrder } from "@/lib/orders";

describe("lookupOrder", () => {
  it("returns the order when the order number and postal code both match", () => {
    const result = lookupOrder("VON-2026-10421", "3011AA");
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.order.status).toBe("shipped");
      expect(result.order.trackingCode).toBe("3SDEMO123456");
    }
  });

  it("is case-insensitive and ignores spaces in the postal code", () => {
    const result = lookupOrder("von-2026-10421", " 3011 aa ");
    expect(result.found).toBe(true);
  });

  it("refuses to return order details when the postal code does not match", () => {
    const result = lookupOrder("VON-2026-10421", "1000AA");
    expect(result.found).toBe(false);
    if (!result.found) {
      expect(result.reason).toBe("postal_mismatch");
    }
  });

  it("reports not_found for an unknown order number", () => {
    const result = lookupOrder("VON-2026-99999", "3011AA");
    expect(result.found).toBe(false);
    if (!result.found) {
      expect(result.reason).toBe("not_found");
    }
  });

  it("never leaks order data on a partial match", () => {
    const result = lookupOrder("VON-2026-10421", "0000ZZ");
    expect(result).not.toHaveProperty("order");
  });
});
