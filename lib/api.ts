// Client for the public website API (nakamadesk-backend /public/*).
// Server components call it with caching; the browser calls it fresh.

import { API_URL, SITE_URL } from "./config";

export type Image = { url: string; alt: string | null };

export type Product = {
  slug: string;
  name: string;
  item_type: string; // "furniture" or "sculpture"
  short_desc: string | null;
  price: string; // decimal string, e.g. "18500.00"
  made_to_order: boolean;
  lead_time_days: number | null;
  in_stock: boolean;
  wood_type: string | null;
  dimensions_mm: { l?: number; w?: number; h?: number } | null;
  category: string | null;
  images: Image[];
  renders: Image[]; // finished-piece render pictures
  model_url: string | null;
  ribbon?: string | null; // new, bestseller, few_left or offer: a label staff put on the photo
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
  upi_link: string | null; // opens a UPI app; only once staff confirmed and money is due
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

/**
 * A smaller copy of a photo for link previews (WhatsApp, Facebook, search results). The original is about 1 MB,
 * and WhatsApp skips the preview picture when it is much over 300 KB. This is this site's own image optimiser
 * (see `images` in next.config.ts), so it only works for photos from the shop's server; any other address is
 * returned as it is. The width and quality must be ones next/image allows: 640 is a default width, 75 the default quality.
 *
 * The optimiser answers in WebP only when the caller says it accepts WebP; a crawler that sends `Accept: star/star`
 * gets a PNG, which is larger (still far smaller than the original). That is why the width is small: 640 is plenty
 * for a preview card. If previews still do not show in WhatsApp, the fix is a ready-made JPEG under 300 KB from the backend.
 */
export function shareImageUrl(path: string): string {
  const src = mediaUrl(path);
  return src.startsWith(`${API_URL}/media/`) ? `${SITE_URL}/_next/image?url=${encodeURIComponent(src)}&w=640&q=75` : src;
}

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

export type PaymentInfo = {
  accepts: string[]; // "cash", "upi"
  upi_id: string | null;
  payee_name: string | null;
  phone: string | null;
  steps: string;
};
export const getPaymentInfo = () => request<PaymentInfo>("/public/payment-info", NO_STORE);

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

// ---- newsletter (double opt-in: subscribe -> email link -> confirm) ----
export type NewsletterSource = "footer" | "journal" | "home";

/** Always answers the same way, so it never reveals who is already subscribed. `website` is a hidden spam trap and stays empty. */
export const subscribeNewsletter = (email: string, source: NewsletterSource, website = "") =>
  request<{ status: string }>("/public/newsletter/subscribe", JSON_POST({ email, source, website }));

export const confirmNewsletter = (token: string) => request<{ status: string }>("/public/newsletter/confirm", JSON_POST({ token }));

export const unsubscribeNewsletter = (token: string) => request<{ status: string }>("/public/newsletter/unsubscribe", JSON_POST({ token }));


// ---- customer comments (only customers with a confirmed order can send one; staff approve before it shows) ----
export type PublicComment = { name: string; place: string | null; piece: string | null; text: string };

/** Approved comments for the home page. An empty list when there are none or the backend cannot be reached. */
export async function getComments(): Promise<PublicComment[]> {
  try {
    return await request<PublicComment[]>("/public/comments", REVALIDATE);
  } catch {
    return [];
  }
}

export type CommentInput = {
  order_number: string;
  phone: string;
  display_name: string;
  place?: string;
  text: string;
  consent: boolean;
  website: string; // hidden spam trap, stays empty
};
export const sendComment = (input: CommentInput) => request<{ status: string }>("/public/comments", JSON_POST(input));


// ---- the line in the top bar (staff edit it; see the backend's /site/admin page) ----
export type Announcement = { message: string; link_url: string | null; link_label: string | null };

/** The announcement to show now, or null (none, switched off, outside its dates, or the backend cannot be reached). */
export async function getAnnouncement(): Promise<Announcement | null> {
  try {
    return await request<Announcement | null>("/public/announcement", REVALIDATE);
  } catch {
    return null;
  }
}
