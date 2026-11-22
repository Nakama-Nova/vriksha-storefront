"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { rupees } from "@/lib/format";
import { DeliveryCheck } from "./DeliveryCheck";
import { Photo } from "./Photo";

export function CartView() {
  const { items, ready, total, count, setQuantity, remove } = useCart();
  const [deliverable, setDeliverable] = useState<boolean | null>(null);

  if (!ready) return <p className="muted">Loading your cart…</p>;
  if (!items.length) {
    return (
      <div className="card warm stack" style={{ alignItems: "flex-start" }}>
        <p>Your cart is empty.</p>
        <Link href="/shop" className="btn primary">
          Browse the shop
        </Link>
      </div>
    );
  }

  const hasBespoke = items.some((i) => i.madeToOrder);
  // Pieces are built one after another by the same workshop, so the order is ready when the slowest piece is.
  const makingDays = Math.max(0, ...items.filter((i) => i.madeToOrder).map((i) => i.leadTimeDays ?? 0));
  return (
    <div className="two-col">
      <div>
        {items.map((i) => (
          <div className="cart-row" key={i.slug}>
            {/* The cart stores the photo's full address; the link next to it already names the piece, so no alt text */}
            <Photo image={i.image ? { url: i.image, alt: "" } : null} name="" sizes="96px" placeholder="" />
            <div className="stack" style={{ gap: 6 }}>
              <Link href={`/shop/${i.slug}`} style={{ fontWeight: 600, textDecoration: "none" }}>
                {i.name}
              </Link>
              {i.madeToOrder && (
                <span className="chip" style={{ alignSelf: "flex-start" }}>
                  Made to order{i.leadTimeDays ? ` · about ${i.leadTimeDays} days` : ""}
                </span>
              )}
              <button type="button" className="link-btn small" style={{ alignSelf: "flex-start" }} onClick={() => remove(i.slug)}>
                Remove
              </button>
            </div>
            <div className="cart-end stack" style={{ alignItems: "flex-end", gap: 8 }}>
              <span className="price">{rupees(i.price * i.quantity)}</span>
              <div className="qty" role="group" aria-label={`Quantity of ${i.name}`}>
                <button type="button" aria-label="Fewer" onClick={() => setQuantity(i.slug, i.quantity - 1)}>
                  −
                </button>
                <span>{i.quantity}</span>
                <button type="button" aria-label="More" onClick={() => setQuantity(i.slug, i.quantity + 1)}>
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="card warm stack" aria-label="Order summary">
        <h2 style={{ fontSize: "1.7rem" }}>Order summary</h2>
        <div className="sum-row">
          <span className="muted">
            Subtotal ({count} {count === 1 ? "item" : "items"})
          </span>
          <span>{rupees(total)}</span>
        </div>
        {makingDays > 0 && (
          <div className="sum-row">
            <span className="muted">Making time</span>
            <span>About {makingDays} days</span>
          </div>
        )}
        <div className="sum-row">
          <span className="muted">Delivery</span>
          <span>Confirmed when we call</span>
        </div>
        <div className="sum-row total">
          <span>Total</span>
          <span>{rupees(total)}</span>
        </div>
        <DeliveryCheck onResult={setDeliverable} />
        <Link
          href="/checkout"
          className="btn primary block"
          aria-disabled={deliverable === false}
          style={deliverable === false ? { pointerEvents: "none", opacity: 0.55 } : undefined}
        >
          Continue to checkout
        </Link>
        <p className="small muted">
          Nothing is charged online. We confirm your order by phone or WhatsApp
          {hasBespoke ? ", then you pay an advance by UPI." : ", then you pay by UPI or cash on delivery."}
        </p>
        <Link href="/shop" className="small" style={{ textAlign: "center" }}>
          Keep browsing
        </Link>
      </aside>
    </div>
  );
}
