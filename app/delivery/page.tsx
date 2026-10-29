import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { POLICY } from "@/lib/legal";

export const metadata: Metadata = { title: "Delivery policy" };

export default function DeliveryPage() {
  return (
    <LegalPage
      title="Delivery policy"
      intro="We deliver by ourselves, locally, so that your piece arrives safely and is placed where you want it. This page says where we deliver, how long it takes and what to do when it arrives."
    >
      <h2>Where we deliver</h2>
      <ul>
        <li>We deliver only to the pincodes we serve. Enter your pincode on the cart or product page to check; if we do not deliver there, it will say so before you order.</li>
        <li>We do not ship by courier or post at the moment. If you are outside our area, send us an enquiry and we will tell you whether we can arrange something.</li>
      </ul>

      <h2>How long it takes</h2>
      <ul>
        <li>
          <strong>In-stock pieces:</strong> we agree a delivery day with you when we confirm your order.
        </li>
        <li>
          <strong>Made-to-order and custom pieces:</strong> the lead time shown on the product page, or agreed with you for a custom piece, counts from the day we receive your advance and the design is agreed. It is an estimate: wood needs time to season and carving cannot be hurried. We tell you early if the date will change.
        </li>
      </ul>

      <h2>Delivery charges</h2>
      <p>Any delivery charge is told to you when we confirm your order, before you pay. There are no hidden extras.</p>

      <h2>When your piece arrives</h2>
      <ul>
        <li>Please be there (or send someone) to receive it, and open and look at the piece in front of our delivery team.</li>
        <li>Tell us about any damage or fault <strong>within {POLICY.reportWithinHours} hours</strong>, with photos, by phone, WhatsApp or email. We will then put it right as set out in our <Link href="/refunds">cancellations and refunds policy</Link>.</li>
        <li>If you are not at home, we will call you to agree another time. If we cannot reach you after several tries, we will keep the piece safe and contact you again, but we may ask you to pay for repeated visits.</li>
        <li>If you chose cash on delivery, the full amount is due when the piece is handed over.</li>
      </ul>

      <h2>Large and heavy pieces</h2>
      <p>Tell us about stairs, lifts, narrow doors or anything else that could make it hard to bring a piece in. If we do not know, we may not be able to complete the delivery on the day, and the change will be agreed with you.</p>
    </LegalPage>
  );
}
