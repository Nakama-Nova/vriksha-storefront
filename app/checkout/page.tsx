import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 28 }}>
        <div className="stack" style={{ gap: 6 }}>
          <h1>Checkout</h1>
          <p className="crumbs" aria-label="Steps">
            <span>1. Cart</span>
            <span aria-hidden="true">›</span>
            <span aria-current="step">2. Your details</span>
            <span aria-hidden="true">›</span>
            <span>3. We call to confirm</span>
          </p>
          <p className="muted">Guest checkout. No account needed, and nothing is charged online.</p>
        </div>
        <CheckoutForm />
      </div>
    </section>
  );
}
