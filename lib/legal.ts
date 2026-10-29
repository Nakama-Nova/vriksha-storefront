// The facts and numbers the policy pages quote. Change them here and every page follows.
// These are sensible defaults for a made-to-order wood shop: the owner should confirm each
// one (and have the pages read by a lawyer) before relying on them.

import { PHONE } from "@/lib/config";

export const SHOP = {
  name: "Vriksha Studios",
  /** Where customers write for anything about their data or an order. */
  email: process.env.NEXT_PUBLIC_EMAIL ?? "info@vrikshastudios.com",
  phone: PHONE,
  /** The workshop address, shown on the policy pages when it is set. */
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "",
  /** True once the shop is registered for GST. Until then no GST is added to any price. */
  gstRegistered: false,
};

export const POLICY = {
  /** Shown at the top of every policy page. Change it whenever a page's meaning changes. */
  updated: "29 October 2026",
  /** Hours after delivery within which damage or a defect must be reported (with photos). */
  reportWithinHours: 48,
  /** Working days within which an agreed refund is paid. */
  refundWithinDays: 7,
  /** We answer a privacy request (see, correct or delete your data) within this many days. */
  privacyReplyDays: 30,
};

export const POLICY_LINKS = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/cookies", label: "Cookie policy" },
  { href: "/terms", label: "Terms of sale" },
  { href: "/delivery", label: "Delivery policy" },
  { href: "/refunds", label: "Cancellations and refunds" },
] as const;
