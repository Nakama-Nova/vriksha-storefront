import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { POLICY, SHOP } from "@/lib/legal";

export const metadata: Metadata = { title: "Cancellations and refunds" };

export default function RefundsPage() {
  return (
    <LegalPage
      title="Cancellations and refunds"
      intro="Most of what we sell is made for you, so the rules depend on whether work has started. We have tried to make them fair and clear. Contact us as early as you can: it is usually easy to sort out."
    >
      <h2>Cancelling an order</h2>
      <ul>
        <li>
          <strong>Before we start work, or for an in-stock piece before delivery:</strong> you can cancel and we refund everything you paid.
        </li>
        <li>
          <strong>After we have started a made-to-order or custom piece:</strong> we cannot sell a piece made to your design to someone else, so the refund depends on how far the work has gone. We tell you what the wood and work so far have cost, you see the figure before you decide, and we refund the rest of your advance.
        </li>
        <li>
          <strong>Once a piece is finished and ready for delivery:</strong> a made-to-order or custom piece cannot be cancelled for a change of mind. If it is not what we agreed, see below.
        </li>
      </ul>
      <p>To cancel, message or call us with your order number. We confirm the cancellation back to you.</p>

      <h2>If a piece is damaged, faulty or not as agreed</h2>
      <p>
        Tell us within {POLICY.reportWithinHours} hours of delivery, with photos. Then, depending on the problem and what you prefer:
      </p>
      <ul>
        <li>we <strong>repair</strong> the piece, free of charge, at your place or in our workshop; or</li>
        <li>we <strong>replace</strong> it with the same piece; or</li>
        <li>if neither is possible or you would rather not, we <strong>refund</strong> what you paid for it and collect it.</li>
      </ul>
      <p>
        This covers damage in transit, faults in the making, and a piece that is not the design, wood or size we agreed. It does not cover the natural variation of wood and hand carving (see our <Link href="/terms">terms of sale</Link>), wear, or damage from misuse.
      </p>

      <h2>Returns for a change of mind</h2>
      <p>
        A made-to-order or custom piece cannot be returned for a change of mind, because it was made for you. For an in-stock piece, please talk to us: if it is in the condition we delivered it we will usually try to help, but we do not promise a return.
      </p>

      <h2>How refunds are paid</h2>
      <ul>
        <li>We refund to the way you paid: to your UPI ID or bank account for an online payment, or by UPI or cash for a payment made on delivery.</li>
        <li>An agreed refund is paid within {POLICY.refundWithinDays} working days of the day we agree it with you.</li>
        <li>We tell you when it is sent, with the reference.</li>
      </ul>

      <h2>If we cancel</h2>
      <p>
        If we cannot make or deliver a piece (for example the wood you chose is not available and you do not want a substitute), we refund everything you paid, as above.
      </p>

      <h2>Need help?</h2>
      <p>
        Contact us at <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
        {SHOP.phone ? <> or {SHOP.phone}</> : null} with your order number. Your rights under Indian consumer law are not affected by this page.
      </p>
    </LegalPage>
  );
}
