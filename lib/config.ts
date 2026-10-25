// All values come from environment variables (see .env.example).
// NEXT_PUBLIC_* are readable in the browser.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");
export const PHONE = process.env.NEXT_PUBLIC_PHONE ?? "";
export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID ?? "";

/** wa.me link, or null until the shop's WhatsApp number is configured. */
export function whatsappUrl(text: string): string | null {
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}` : null;
}
