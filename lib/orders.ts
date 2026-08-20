import fs from "fs";
import path from "path";

export type OrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "delayed"
  | "cancelled";

export interface Order {
  orderNumber: string;
  postalCode: string;
  status: OrderStatus;
  carrier?: string;
  trackingCode?: string;
  estimatedDelivery: string | null;
  items: string[];
}

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

function loadOrders(): Order[] {
  const raw = fs.readFileSync(ORDERS_PATH, "utf-8");
  return JSON.parse(raw) as Order[];
}

function normalizePostalCode(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

function normalizeOrderNumber(value: string): string {
  return value.trim().toUpperCase();
}

export type OrderLookupResult =
  | { found: true; order: Order }
  | { found: false; reason: "not_found" | "postal_mismatch" };

/**
 * Both the order number and postal code must match before any order details
 * are returned. This mirrors a real verification step and prevents the
 * agent from ever leaking order data on a partial match.
 */
export function lookupOrder(
  orderNumber: string,
  postalCode: string
): OrderLookupResult {
  const orders = loadOrders();
  const normalizedOrderNumber = normalizeOrderNumber(orderNumber);
  const normalizedPostalCode = normalizePostalCode(postalCode);

  const byNumber = orders.find(
    (order) => normalizeOrderNumber(order.orderNumber) === normalizedOrderNumber
  );

  if (!byNumber) {
    return { found: false, reason: "not_found" };
  }

  if (normalizePostalCode(byNumber.postalCode) !== normalizedPostalCode) {
    return { found: false, reason: "postal_mismatch" };
  }

  return { found: true, order: byNumber };
}
