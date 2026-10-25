"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import type { PublicOrder } from "@/lib/api";
import { UPI_ID } from "@/lib/config";
import { rupees } from "@/lib/format";
import { LAST_ORDER_KEY } from "./CheckoutForm";

type Saved = PublicOrder & { name?: string; pay_option?: string };

const noopSubscribe = () => () => {};
function savedOrder(): string | null {
  try {
    return sessionStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
}

export function ThanksView() {
  // undefined on the server / before hydration, then the saved order text (or null)
  const raw = useSyncExternalStore(noopSubscribe, savedOrder, () => undefined);
  const order = useMemo<Saved | null>(() => {
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [raw]);

  if (raw === undefined) return null;
  const first = order?.name?.split(" ")[0];
  const upfront = order?.pay_option !== "on_delivery";

  return (
    <div className="stack" style={{ alignItems: "center", textAlign: "center", gap: 24, maxWidth: 760, margin: "0 auto" }}>
      <div className="num" style={{ width: 72, height: 72, fontSize: "2rem" }} aria-hidden="true">
        ✓
      </div>
      <h1>{first ? `Thank you, ${first}!` : "Thank you!"}</h1>
      {order ? (
        <p className="muted" style={{ fontSize: "1.1rem" }}>
          We have received your order <strong>{order.order_number}</strong> ({rupees(order.total)}). We will call or WhatsApp you to confirm the price and delivery date.
        </p>
      ) : (
        <p className="muted">We have received your order and will call or WhatsApp you to confirm.</p>
      )}

      <div className="card stack" style={{ textAlign: "left", width: "100%" }}>
        <h2 style={{ fontSize: "1.8rem" }}>What happens next</h2>
        <ol className="steps">
          <li>
            <span className="num">1</span>
            <span>
              <strong>We confirm with you</strong>
              <br />
              <span className="muted small">A quick call or WhatsApp to agree the details and the delivery date.</span>
            </span>
          </li>
          {upfront && (
            <li>
              <span className="num">2</span>
              <span>
                <strong>You pay the advance by UPI</strong>
                <br />
                <span className="muted small">
                  {UPI_ID ? (
                    <>
                      Pay to <strong>{UPI_ID}</strong> and tell us. We note it against your order.
                    </>
                  ) : (
                    "We will share the UPI details when we call you."
                  )}
                </span>
              </span>
            </li>
          )}
          <li>
            <span className="num">{upfront ? 3 : 2}</span>
            <span>
              <strong>We build and deliver</strong>
              <br />
              <span className="muted small">You can follow progress on the Track order page{order ? ` with ${order.order_number}` : ""}.</span>
            </span>
          </li>
        </ol>
      </div>

      <div className="row" style={{ justifyContent: "center" }}>
        <Link href="/track" className="btn primary">
          Track this order
        </Link>
        <Link href="/shop" className="btn outline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
