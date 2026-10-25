import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 28 }}>
        <h1>Your cart</h1>
        <CartView />
      </div>
    </section>
  );
}
