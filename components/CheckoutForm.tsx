"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiError, placeOrder, type CheckoutInput } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { rupees } from "@/lib/format";

export const LAST_ORDER_KEY = "vriksha-last-order";

export function CheckoutForm() {
  const { items, ready, total, clear } = useCart();
  const router = useRouter();
  const [pay, setPay] = useState<CheckoutInput["pay_option"]>("advance_upi");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!ready) return <p className="muted">Loading…</p>;
  if (!items.length) {
    return (
      <div className="card warm stack" style={{ alignItems: "flex-start" }}>
        <p>Your cart is empty, so there is nothing to check out.</p>
        <Link href="/shop" className="btn primary">
          Browse the shop
        </Link>
      </div>
    );
  }

  const hasBespoke = items.some((i) => i.madeToOrder);
  // Pay on delivery is only for pieces that are already built
  const payOption = hasBespoke ? "advance_upi" : pay;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    const input: CheckoutInput = {
      name: text("name"),
      phone: text("phone"),
      email: text("email") || undefined,
      address: text("address"),
      town: text("town"),
      pincode: text("pincode"),
      note: text("note") || undefined,
      pay_option: payOption,
      items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
    };
    setBusy(true);
    try {
      const order = await placeOrder(input);
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify({ ...order, name: input.name, pay_option: input.pay_option }));
      clear();
      router.push("/thanks");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form className="two-col" onSubmit={onSubmit}>
      <div className="stack" style={{ gap: 24 }}>
        <section className="card stack">
          <h2 style={{ fontSize: "1.6rem" }}>Contact</h2>
          <div className="grid2">
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" className="input" required minLength={2} maxLength={100} autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="phone">WhatsApp number</label>
              <input id="phone" name="phone" className="input" type="tel" required autoComplete="tel" placeholder="98765 43210" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="email">Email (optional)</label>
            <input id="email" name="email" className="input" type="email" autoComplete="email" />
          </div>
        </section>

        <section className="card stack">
          <h2 style={{ fontSize: "1.6rem" }}>Delivery address</h2>
          <div className="field">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" className="input" required minLength={5} maxLength={300} autoComplete="street-address" placeholder="House or flat, street, landmark" />
          </div>
          <div className="grid2">
            <div className="field">
              <label htmlFor="town">Town or area</label>
              <input id="town" name="town" className="input" required minLength={2} maxLength={100} autoComplete="address-level2" />
            </div>
            <div className="field">
              <label htmlFor="pincode">Pincode</label>
              <input id="pincode" name="pincode" className="input" required inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="postal-code" placeholder="6 digits" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="note">Note for the delivery team (optional)</label>
            <textarea id="note" name="note" className="textarea" maxLength={500} placeholder="Gate code, preferred time, floor" />
          </div>
        </section>

        <section className="card stack" role="radiogroup" aria-label="How would you like to pay?">
          <h2 style={{ fontSize: "1.6rem" }}>How would you like to pay?</h2>
          <label className={`option${payOption === "advance_upi" ? " on" : ""}`}>
            <input type="radio" name="pay" checked={payOption === "advance_upi"} onChange={() => setPay("advance_upi")} />
            <span className="stack" style={{ gap: 4 }}>
              <strong>Pay an advance by UPI after we confirm</strong>
              <span className="muted small">We call you, agree the advance, and share the UPI details. Required for made-to-order pieces.</span>
            </span>
          </label>
          <label className={`option${payOption === "on_delivery" ? " on" : ""}${hasBespoke ? " disabled" : ""}`}>
            <input type="radio" name="pay" disabled={hasBespoke} checked={payOption === "on_delivery"} onChange={() => setPay("on_delivery")} />
            <span className="stack" style={{ gap: 4 }}>
              <strong>Pay on delivery</strong>
              <span className="muted small">
                {hasBespoke ? "Not available: your cart has a made-to-order piece." : "Cash or UPI to our team when the piece arrives. Pieces in stock only."}
              </span>
            </span>
          </label>
        </section>
      </div>

      <aside className="card warm stack" aria-label="Your order">
        <h2 style={{ fontSize: "1.7rem" }}>Your order</h2>
        {items.map((i) => (
          <div className="sum-row small" key={i.slug}>
            <span className="muted">
              {i.name} × {i.quantity}
            </span>
            <span>{rupees(i.price * i.quantity)}</span>
          </div>
        ))}
        <div className="sum-row total">
          <span>Total</span>
          <span>{rupees(total)}</span>
        </div>
        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="btn primary block" disabled={busy}>
          {busy ? "Placing order…" : "Place order"}
        </button>
        <p className="small muted">
          By placing the order you agree that we will contact you to confirm the price and delivery date before any payment. We use your details only for your order; see our <Link href="/privacy">privacy policy</Link>, <Link href="/terms">terms of sale</Link> and <Link href="/refunds">cancellations and refunds</Link>.
        </p>
      </aside>
    </form>
  );
}
