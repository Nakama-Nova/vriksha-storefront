// The shop's own visitor numbers: one tap on a daily total for a page or an action, nothing about the visitor.
// No cookie, no identifier and no address is stored (see the backend's /public/hit and our privacy policy).
// Nothing is sent when the browser says "do not track" or sends Global Privacy Control, nor while developing.

import { API_URL } from "./config";

export type HitKind = "view" | "event";
/** The actions the backend counts. Anything else is ignored there. */
export type EventName = "add_to_cart" | "checkout_open" | "order_placed" | "enquiry_sent" | "comment_sent" | "video_play" | "whatsapp_click";

type PrivacyNavigator = Navigator & { globalPrivacyControl?: boolean };

/** False when the visitor has asked not to be counted. */
export function mayCount(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as PrivacyNavigator;
  const dnt = n.doNotTrack === "1" || (typeof window !== "undefined" && (window as unknown as { doNotTrack?: string }).doNotTrack === "1");
  return !(dnt || n.globalPrivacyControl === true);
}

export function hit(kind: HitKind, key: string): void {
  if (process.env.NODE_ENV === "development" || !mayCount()) return;
  try {
    fetch(`${API_URL}/public/hit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, key }),
      keepalive: true, // still sent when the page is closing
      cache: "no-store",
    }).catch(() => {}); // counting must never get in the way of the shop
  } catch {}
}

export const trackView = (path: string) => hit("view", path);
export const trackEvent = (name: EventName) => hit("event", name);
