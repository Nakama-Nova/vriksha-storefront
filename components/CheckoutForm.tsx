"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ApiError, checkDelivery, placeOrder, type CheckoutInput } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { rupees } from "@/lib/format";
import { ErrorSummary, FieldError, fieldA11y, useFieldErrors, useHydrated } from "./FormErrors";
import { check, pickFields, rules } from "@/lib/formErrors";
import { trackEvent } from "@/lib/track";

const ORDER = ["name", "phone", "email", "address", "town", "pincode"];
const LABELS: Record<string, string> = { name: "Your name", phone: "WhatsApp number", email: "Email", address: "Address", town: "Town or area", pincode: "Pincode" };
const RULES = {
  name: [rules.minLength(2, "Enter your name")],
  phone: [rules.mobile()],
  email: [rules.optionalEmail()],
  address: [rules.minLength(5, "Enter your delivery address, like house or flat, street, landmark")],
  town: [rules.minLength(2, "Enter your town or area")],
  pincode: [rules.pincode()],
};

export const LAST_ORDER_KEY = "vriksha-last-order";

export function CheckoutForm() {
  const { items, ready, total, clear } = useCart();
  const router = useRouter();
  const [pay, setPay] = useState<CheckoutInput["pay_option"]>("advance_upi");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { errors, setErrors, onInput, show } = useFieldErrors(ORDER);
  const hydrated = useHydrated();
  const pinSeq = useRef(0); // so a slow older pincode answer cannot overwrite a newer one
  // Does the shop deliver to the pincode typed so far? Checked as soon as 6 digits are in, so a "no" is not found out at the end.
  const [area, setArea] = useState<"idle" | "yes" | "no">("idle");

  const hasItems = items.length > 0;
  useEffect(() => {
    if (ready && hasItems) trackEvent("checkout_open");
  }, [ready, hasItems]);

  async function onPincode(value: string) {
    const mine = ++pinSeq.current;
    if (!/^\d{6}$/.test(value)) return setArea("idle");
    try {
      const r = await checkDelivery(value);
      if (mine === pinSeq.current) setArea(r.serviceable ? "yes" : "no");
    } catch {
      if (mine === pinSeq.current) setArea("idle"); // could not check: say nothing, the shop confirms the address by phone anyway
    }
  }

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
  const makingDays = Math.max(0, ...items.filter((i) => i.madeToOrder).map((i) => i.leadTimeDays ?? 0));
  // Pay on delivery is only for pieces that are already built
  const payOption = hasBespoke ? "advance_upi" : pay;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const found = check(f, RULES);
    if (Object.keys(found).length) return show(found);
    setErrors({});
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
      trackEvent("order_placed");
      clear();
      router.push("/thanks");
    } catch (err) {
      const fromServer = err instanceof ApiError ? pickFields(err.fields, {}) : {};
      const mine = Object.fromEntries(Object.entries(fromServer).filter(([k]) => ORDER.includes(k)));
      if (Object.keys(mine).length) show(mine);
      else setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form className="two-col" onSubmit={onSubmit} onInput={onInput} noValidate>
      <div className="stack" style={{ gap: 24 }}>
        <ErrorSummary errors={errors} labels={LABELS} order={ORDER} />
        <section className="card stack">
          <h2 style={{ fontSize: "1.6rem" }}>Contact</h2>
          <div className="grid2">
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" className="input" required minLength={2} maxLength={100} autoComplete="name" {...fieldA11y("name", errors)} />
              <FieldError name="name" errors={errors} />
            </div>
            <div className="field">
              <label htmlFor="phone">WhatsApp number</label>
              <input id="phone" name="phone" className="input" type="tel" inputMode="tel" required autoComplete="tel" placeholder="98765 43210" {...fieldA11y("phone", errors, "phone-note")} />
              <FieldError name="phone" errors={errors} />
              <p id="phone-note" className="small muted">
                We call or WhatsApp this number to confirm.
              </p>
            </div>
          </div>
          <div className="field">
            <label htmlFor="email">Email (optional)</label>
            <input id="email" name="email" className="input" type="email" autoComplete="email" maxLength={254} {...fieldA11y("email", errors, "email-note")} />
            <FieldError name="email" errors={errors} />
            <p id="email-note" className="small muted">
              If you add one, we email you when we receive your order, when it is confirmed and when we receive a payment. No other emails; see our <Link href="/privacy">privacy policy</Link>.
            </p>
          </div>
        </section>

        <section className="card stack">
          <h2 style={{ fontSize: "1.6rem" }}>Delivery address</h2>
          <div className="field">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" className="input" required minLength={5} maxLength={300} autoComplete="street-address" placeholder="House or flat, street, landmark" {...fieldA11y("address", errors)} />
            <FieldError name="address" errors={errors} />
          </div>
          <div className="grid2">
            <div className="field">
              <label htmlFor="town">Town or area</label>
              <input id="town" name="town" className="input" required minLength={2} maxLength={100} autoComplete="address-level2" {...fieldA11y("town", errors)} />
              <FieldError name="town" errors={errors} />
            </div>
            <div className="field">
              <label htmlFor="pincode">Pincode</label>
              <input
                id="pincode"
                name="pincode"
                className="input"
                required
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                autoComplete="postal-code"
                placeholder="6 digits"
                onChange={(e) => onPincode(e.target.value.trim())}
                {...fieldA11y("pincode", errors, "pincode-hint")}
              />
              <FieldError name="pincode" errors={errors} />
              <p id="pincode-hint" className={`field-hint ${area === "yes" ? "ok" : area === "no" ? "bad" : ""}`} aria-live="polite">
                {area === "yes" && "✓ We deliver to this pincode."}
                {area === "no" && "We do not deliver here yet. You can still place the order and we will call to see what is possible."}
              </p>
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
        <p className="small muted">Any delivery charge is told to you when we call, before you pay.</p>
        <div className="stack" style={{ gap: 8 }}>
          <strong className="small">What happens next</strong>
          <ol className="next-steps small">
            <li>
              <span className="num">1</span>
              <span>You place the order. <strong>Nothing is charged now.</strong></span>
            </li>
            <li>
              <span className="num">2</span>
              <span>We call or WhatsApp you to confirm the price{makingDays > 0 ? `, the making time (about ${makingDays} days)` : ""} and the delivery day.</span>
            </li>
            <li>
              <span className="num">3</span>
              <span>{payOption === "advance_upi" ? "You pay the advance by UPI and we start work." : "You pay cash or UPI when it arrives."}</span>
            </li>
          </ol>
        </div>
        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="btn primary block" disabled={busy || !hydrated}>
          {busy ? "Placing order…" : "Place order (nothing to pay now)"}
        </button>
        <p className="small muted">
          By placing the order you agree that we will contact you to confirm the price and delivery date before any payment. We use your details only for your order; see our <Link href="/privacy">privacy policy</Link>, <Link href="/terms">terms of sale</Link> and <Link href="/refunds">cancellations and refunds</Link>.
        </p>
      </aside>
    </form>
  );
}
