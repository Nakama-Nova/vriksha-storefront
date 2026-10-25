import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 28 }}>
        <div className="stack" style={{ gap: 6 }}>
          <h1>Checkout</h1>
          <p className="muted">Guest checkout. No account needed.</p>
        </div>
        <CheckoutForm />
      </div>
    </section>
  );
}
