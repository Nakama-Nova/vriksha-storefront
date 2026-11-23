import { POLICY } from "@/lib/legal";

// Reasons to feel safe buying here. Every line is something the shop's own policy pages promise
// (see lib/legal.ts and /delivery, /terms, /refunds); change the page and this together.
const POINTS = [
  {
    title: "Made in our own workshop",
    text: "Solid wood, crafted by our own makers. Made to order pieces are built for you.",
    icon: "M3 21V10l9-6 9 6v11M9 21v-6h6v6",
  },
  {
    title: "Nothing to pay online",
    text: "We call to confirm first. Then pay by UPI, or cash on delivery for pieces in stock.",
    icon: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  },
  {
    title: "Delivered by our own team",
    text: "We bring it to your door and place it where you want it.",
    icon: "M2 6h11v9H2zM13 9h4l3 3v3h-7M6 18.5a1.5 1.5 0 1 0 0-.01M16 18.5a1.5 1.5 0 1 0 0-.01",
  },
  {
    title: "We put it right",
    text: `Tell us within ${POLICY.reportWithinHours} hours of delivery if anything is wrong, and we will fix it.`,
    icon: "M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6zM8.5 12l2.5 2.5L16 9.5",
  },
] as const;

/** `bar` is a row for the home page; `list` is a compact stack for the product page. */
export function TrustPoints({ variant = "bar", only }: { variant?: "bar" | "list"; only?: number[] }) {
  const shown = only ? POINTS.filter((_, i) => only.includes(i)) : POINTS;
  return (
    <ul className={`trust trust-${variant}`}>
      {shown.map((p) => (
        <li key={p.title}>
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={p.icon} />
          </svg>
          <span>
            <strong>{p.title}</strong>
            <span className="muted small">{p.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
