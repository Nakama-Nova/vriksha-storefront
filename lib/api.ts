// Client for the public website API (nakamadesk-backend /public/*).
// Server components call it with caching; the browser calls it fresh.

import { API_URL } from "./config";

export type Image = { url: string; alt: string | null };

export type Product = {
  slug: string;
  name: string;
  short_desc: string | null;
  price: string; // decimal string, e.g. "18500.00"
  made_to_order: boolean;
  lead_time_days: number | null;
  in_stock: boolean;
  wood_type: string | null;
  dimensions_mm: { l?: number; w?: number; h?: number } | null;
  category: string | null;
  images: Image[];
  model_url: string | null;
};

export type OrderLine = { name: string; quantity: number; unit_price: string };

export type PublicOrder = {
  order_number: string;
  status: string;
  order_type: string;
  placed_on: string;
  expected_delivery: string | null;
  total: string;
  advance_paid: string;
  balance_due: string;
  items: OrderLine[];
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** Backend media paths are relative ("/media/..."); make them absolute. */
export const mediaUrl = (path: string) => (path.startsWith("http") ? path : `${API_URL}${path}`);

/** FastAPI errors: {detail: "text"} or {detail: [{msg, loc}]} for validation. */
function messageFrom(body: unknown, status: number): string {
  const detail = (body as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length) {
    const first = detail[0] as { msg?: string; loc?: unknown[] };
    const field = Array.isArray(first.loc) ? String(first.loc[first.loc.length - 1]) : "";
    return field ? `${field}: ${first.msg}` : (first.msg ?? "Please check the form");
  }
  if (status === 429) return "Too many requests. Please try again in a minute.";
  return "Something went wrong. Please try again.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, init);
  } catch {
    throw new ApiError("Cannot reach the shop server. Please try again shortly.", 0);
  }
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {}
    throw new ApiError(messageFrom(body, res.status), res.status);
  }
  return res.json() as Promise<T>;
}

// ---- server side: cached for a minute so the shop stays fast and cheap ----
const REVALIDATE = { next: { revalidate: 60 } } as const;
const PAGE = 50; // the API's maximum page size

/** Whole catalogue, or null when the backend cannot be reached. */
export async function getCatalog(): Promise<Product[] | null> {
  try {
    const all: Product[] = [];
    for (let offset = 0; offset < PAGE * 4; offset += PAGE) {
      const page = await request<Product[]>(`/public/catalog?limit=${PAGE}&offset=${offset}`, REVALIDATE);
      all.push(...page);
      if (page.length < PAGE) break;
    }
    return all;
  } catch {
    return null;
  }
}

/** One product; null if it does not exist (or the backend is down). */
export async function getProduct(slug: string): Promise<Product | null> {
  try {
    return await request<Product>(`/public/catalog/${encodeURIComponent(slug)}`, REVALIDATE);
  } catch {
    return null;
  }
}

// ---- browser side: always fresh ----
const NO_STORE = { cache: "no-store" } as const;
const JSON_POST = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
  ...NO_STORE,
});

export const checkDelivery = (pincode: string) =>
  request<{ pincode: string; serviceable: boolean }>(`/public/delivery-check?pincode=${encodeURIComponent(pincode)}`, NO_STORE);

export type CheckoutInput = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  town: string;
  pincode: string;
  note?: string;
  pay_option: "advance_upi" | "on_delivery";
  items: { slug: string; quantity: number }[];
};
export const placeOrder = (input: CheckoutInput) => request<PublicOrder>("/public/checkout", JSON_POST(input));

export type EnquiryInput = {
  name: string;
  phone: string;
  what: string;
  description: string;
  wood?: string;
  size?: string;
  budget?: string;
};
export const sendEnquiry = (input: EnquiryInput) => request<PublicOrder>("/public/enquiry", JSON_POST(input));

/** The phone goes in the query string only to the API (never into this site's URLs). */
export const trackOrder = (orderNumber: string, phone: string) =>
  request<PublicOrder>(`/public/orders/${encodeURIComponent(orderNumber.trim())}?phone=${encodeURIComponent(phone)}`, NO_STORE);
