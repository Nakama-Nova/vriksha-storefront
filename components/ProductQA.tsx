import Link from "next/link";
import type { Product } from "@/lib/api";
import { POLICY } from "@/lib/legal";

/** Answers drawn from the shop's own policy pages (see /faq, /delivery, /terms, /refunds). Change those and these together. */
export function ProductQA({ product: p }: { product: Product }) {
  const items: { q: string; a: React.ReactNode }[] = [
    {
      q: p.made_to_order ? "How long will this take to make?" : "When can I get it?",
      a: p.made_to_order ? (
        <>
          {p.lead_time_days ? `About ${p.lead_time_days} days, counted from the day we receive your advance and agree the design. ` : "We tell you the time when we confirm your order. "}
          It is an estimate: wood needs time to season and carving cannot be hurried. We tell you early if the date changes.
        </>
      ) : (
        <>It is in stock. We agree a delivery day with you when we confirm your order.</>
      ),
    },
    {
      q: "Can I change the size, wood or finish?",
      a: (
        <>
          Yes. Use <Link href={`/custom?piece=${encodeURIComponent(p.name)}`}>Ask for a custom version</Link> above or send a custom-order enquiry. We agree the design and price with you before work begins.
        </>
      ),
    },
    {
      q: "How and when do I pay?",
      a: (
        <>
          Nothing is charged on this website. After you order we call you to confirm. Then you pay by UPI: {p.made_to_order ? "an advance to begin the work." : "in advance, or on delivery where we offer it."} We confirm every payment to you.
        </>
      ),
    },
    {
      q: "Do you deliver to my area?",
      a: (
        <>
          We deliver with our own team to the pincodes we serve. Check yours in the box near the price. See our <Link href="/delivery">delivery policy</Link>.
        </>
      ),
    },
    {
      q: "What if something is wrong when it arrives?",
      a: (
        <>
          Tell us within {POLICY.reportWithinHours} hours with photos and we will repair it, replace it or refund it. See <Link href="/refunds">cancellations and refunds</Link>.
        </>
      ),
    },
  ];
  return (
    <section className="stack" aria-labelledby="qa" style={{ gap: 14 }}>
      <h2 id="qa">Questions and answers</h2>
      <div className="stack" style={{ gap: 10 }}>
        {items.map((it) => (
          <details key={it.q} className="card faq">
            <summary>
              <strong>{it.q}</strong>
            </summary>
            <p style={{ marginTop: 10 }}>{it.a}</p>
          </details>
        ))}
      </div>
      <p className="small muted">
        More in our <Link href="/faq">questions and answers</Link>.
      </p>
    </section>
  );
}
