import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { POLICY, SHOP } from "@/lib/legal";

export const metadata: Metadata = { title: "Questions and answers" };

const QA: { q: string; a: ReactNode }[] = [
  {
    q: "Where do you deliver?",
    a: (
      <>
        We deliver ourselves, to the pincodes we serve. Enter your pincode on the cart or a product page to check. Details are in our <Link href="/delivery">delivery policy</Link>.
      </>
    ),
  },
  {
    q: "How long will my piece take?",
    a: (
      <>
        Pieces in stock are delivered on a day we agree with you. Made-to-order pieces take the lead time shown on the product page; we confirm the date when we confirm your order, and tell you early if it changes. Carving and seasoning wood cannot be hurried.
      </>
    ),
  },
  {
    q: "How do I pay?",
    a: (
      <>
        By UPI to our UPI ID, which we give you when you order. Made-to-order and custom pieces need an advance to begin work; in-stock pieces can be paid on delivery where we offer it. We do not take card details on this website. We confirm every payment to you.
      </>
    ),
  },
  {
    q: "Do the prices include GST?",
    a: SHOP.gstRegistered ? (
      <>Yes, the prices you see include GST.</>
    ) : (
      <>We are not registered for GST at the moment, so no GST is added. The price you are told when you order is the price you pay.</>
    ),
  },
  {
    q: "Can I order something that is not on the website?",
    a: (
      <>
        Yes. Send us a <Link href="/custom">custom-order enquiry</Link> with what you have in mind: the piece, the wood, the size and a photo or sketch if you have one. We reply, agree the design and price with you, and then begin.
      </>
    ),
  },
  {
    q: "Can I change or cancel my order?",
    a: (
      <>
        Yes, as early as you can tell us. Before work starts it is free. After work has started on a made-to-order piece, the refund depends on how far it has gone. See <Link href="/refunds">cancellations and refunds</Link>.
      </>
    ),
  },
  {
    q: "What if my piece arrives damaged?",
    a: (
      <>
        Tell us within {POLICY.reportWithinHours} hours with photos, and we will repair it, replace it or refund it. Natural variation in wood grain and hand carving is not a defect; see our <Link href="/terms">terms of sale</Link>.
      </>
    ),
  },
  {
    q: "How do I track my order?",
    a: (
      <>
        Use <Link href="/track">Track your order</Link> with your order number and the phone number you ordered with. You can also call or message us.
      </>
    ),
  },
  {
    q: "Is my information safe?",
    a: (
      <>
        We collect only what we need to make and deliver your order, and we do not sell it. This site sets no cookies and uses no tracking. Read our <Link href="/privacy">privacy policy</Link> and <Link href="/cookies">cookie policy</Link>.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <LegalPage title="Questions and answers" intro="The things people ask us most. If yours is not here, write or call and we will answer.">
      <div className="stack" style={{ gap: 10 }}>
        {QA.map((item) => (
          <details key={item.q} className="card faq">
            <summary>
              <strong>{item.q}</strong>
            </summary>
            <p style={{ marginTop: 10 }}>{item.a}</p>
          </details>
        ))}
      </div>
    </LegalPage>
  );
}
