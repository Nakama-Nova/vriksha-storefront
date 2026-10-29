import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { POLICY, SHOP } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms of sale" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of sale"
      intro={`These terms apply when you order from ${SHOP.name} through this website, by phone or on WhatsApp. By placing an order or sending an enquiry you agree to them. They sit alongside our delivery policy, our cancellations and refunds policy and our privacy policy.`}
    >
      <h2>Who we are</h2>
      <p>
        {SHOP.name} is a workshop that makes wood furniture and carved art and sells it directly. You can reach us at <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
        {SHOP.phone ? <> or {SHOP.phone}</> : null}.
      </p>

      <h2>Pieces and prices</h2>
      <ul>
        <li>All prices are in Indian rupees (₹).</li>
        {SHOP.gstRegistered ? (
          <li>Prices on the website include GST.</li>
        ) : (
          <li>We are not registered for GST at the moment, so no GST is added to any price. If that changes, the price you were told when you ordered still stands.</li>
        )}
        <li>The price you see on the website is the price of the piece. Any delivery charge is told to you before you pay.</li>
        <li>We try to keep every price and description correct. If we find a mistake in a price after you order, we will tell you and you may cancel for a full refund or go ahead at the correct price.</li>
      </ul>

      <h2>Wood is a natural material</h2>
      <p>
        Every piece is made from real wood and is often carved by hand. Grain, colour, knots and small differences in carving are part of the character of the piece and are not defects. Photos are taken in our workshop and your screen may show colours differently. A piece you receive can differ a little from its photo.
      </p>

      <h2>How an order works</h2>
      <ol>
        <li>
          <strong>You place an order or send an enquiry.</strong> That is a request, not yet a sale.
        </li>
        <li>
          <strong>We contact you</strong> to confirm the price, anything special about the piece and the delivery date, before any payment.
        </li>
        <li>
          <strong>You pay</strong> as agreed. In-stock pieces can be paid on delivery where we offer it; made-to-order and custom pieces need an advance by UPI to begin work.
        </li>
        <li>
          <strong>We make (if needed) and deliver</strong> the piece, and you pay any balance.
        </li>
      </ol>
      <p>The order becomes a sale when we have confirmed it with you. We may decline an order, for example if a piece is no longer available, and if we have taken money for it we refund it in full.</p>

      <h2>Made-to-order and custom pieces</h2>
      <ul>
        <li>The lead time on a product page is our best estimate, not a promise to the day. We confirm the date when we confirm the order and tell you early if it will change.</li>
        <li>For a custom piece, we agree the design, wood, size and price with you first, in writing (a message is enough). Changes after work starts can change the price and the date.</li>
        <li>Because a made-to-order piece is made for you, the rules for cancelling it are different. See <Link href="/refunds">cancellations and refunds</Link>.</li>
      </ul>

      <h2>Payment</h2>
      <p>
        We accept UPI to the UPI ID we give you when you order, and cash on delivery for in-stock pieces where it is offered. We do not take card payments on this website. Please check the name shown in your UPI app before you pay, and keep the payment reference. We confirm each payment to you.
      </p>

      <h2>Delivery and risk</h2>
      <p>
        We deliver as described in our <Link href="/delivery">delivery policy</Link>. A piece is yours once you have paid in full. It is your responsibility from the moment it is handed to you, and you should check it then.
      </p>

      <h2>If something is wrong</h2>
      <p>
        If a piece arrives damaged or with a fault, tell us within {POLICY.reportWithinHours} hours of delivery, with photos, and we will put it right as set out in our <Link href="/refunds">cancellations and refunds policy</Link>. Our responsibility for a piece is limited to repairing it, replacing it or refunding what you paid for it. Nothing in these terms limits any right you have under Indian consumer law.
      </p>

      <h2>Care of your piece</h2>
      <p>Wood reacts to heat, damp and direct sunlight. We give care advice when we deliver. Damage caused by misuse, or by leaving a piece in conditions it is not made for, is not a fault in the piece.</p>

      <h2>Our designs and photos</h2>
      <p>The designs, carvings, photos and text on this website belong to {SHOP.name}. Please do not copy or reuse them without asking us.</p>

      <h2>Using this website</h2>
      <p>Please give true details when you order, and do not misuse the site, for example with automated orders. We may refuse or cancel an order that looks like misuse.</p>

      <h2>Law and disputes</h2>
      <p>These terms are governed by the laws of India. If something goes wrong, please talk to us first; we would like to put it right. If we cannot agree, you may use the consumer remedies the law gives you.</p>

      <h2>If part of these terms cannot apply</h2>
      <p>If a court finds any part of these terms cannot be enforced, the rest still applies. These terms, with our delivery, cancellations and refunds and privacy policies and what we confirm with you about your order, are the whole agreement between us about it.</p>

      <h2>Changes</h2>
      <p>We may update these terms. The version that applies to an order is the one on this page on the day you placed it.</p>
    </LegalPage>
  );
}
