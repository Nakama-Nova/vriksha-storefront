"use client";

import { useState, type FormEvent } from "react";
import { ApiError, trackOrder, type PublicOrder } from "@/lib/api";
import { dateText, rupees } from "@/lib/format";

// Order lifecycle (backend): draft -> confirmed -> in_production -> ready -> delivered
const STEPS = [
  ["draft", "Received"],
  ["confirmed", "Confirmed"],
  ["in_production", "In production"],
  ["ready", "Ready"],
  ["delivered", "Delivered"],
] as const;

function Progress({ status }: { status: string }) {
  if (status === "cancelled") return <div className="alert error">This order was cancelled. Call us if you have questions.</div>;
  const at = STEPS.findIndex(([s]) => s === status);
  return (
    <ol className="progress" aria-label="Order progress" style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {STEPS.map(([s, label], i) => {
        const state = i < at ? "done" : i === at ? "now" : "";
        return (
          <li key={s} style={{ display: "contents" }}>
            <div className={`step ${state}`} aria-current={i === at ? "step" : undefined}>
              <span className="dot">{i < at ? "✓" : i === at ? "●" : ""}</span>
              <span>{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={`line${i < at ? " done" : ""}`} aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

export function TrackForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<PublicOrder | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setOrder(null);
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      setOrder(await trackOrder(String(f.get("number") ?? ""), String(f.get("phone") ?? "")));
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 404
          ? "We could not find that order. Check the order number and the phone number you used."
          : err instanceof ApiError
            ? err.message
            : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack" style={{ gap: 28 }}>
      <form className="row" style={{ alignItems: "flex-end" }} onSubmit={onSubmit}>
        <div className="field" style={{ flex: "1 1 220px" }}>
          <label htmlFor="number">Order number</label>
          <input id="number" name="number" className="input" required placeholder="e.g. ORD-2026-0014" autoCapitalize="characters" />
        </div>
        <div className="field" style={{ flex: "1 1 220px" }}>
          <label htmlFor="phone">Phone number</label>
          <input id="phone" name="phone" className="input" type="tel" required autoComplete="tel" placeholder="The number you ordered with" />
        </div>
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? "Checking…" : "Track order"}
        </button>
      </form>

      <div aria-live="polite">
        {error && (
          <div className="alert error" role="alert">
            {error}
          </div>
        )}
      </div>

      {order && (
        <div className="card stack" style={{ gap: 24 }}>
          <div className="row between">
            <div className="stack" style={{ gap: 2 }}>
              <h2 style={{ fontSize: "2rem" }}>{order.order_number}</h2>
              <p className="muted small">
                Placed on {dateText(order.placed_on)}
                {order.expected_delivery ? ` · Expected delivery ${dateText(order.expected_delivery)}` : ""}
              </p>
            </div>
            {order.order_type === "custom" && <span className="chip">Custom piece</span>}
          </div>
          <Progress status={order.status} />
          <div className="stack" style={{ gap: 8, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
            {order.items.map((l, i) => (
              <div className="sum-row" key={i}>
                <span>
                  {l.name} × {l.quantity}
                </span>
                <span>{Number(l.unit_price) > 0 ? rupees(Number(l.unit_price) * l.quantity) : "Quote pending"}</span>
              </div>
            ))}
            {Number(order.total) > 0 && (
              <>
                <div className="sum-row muted">
                  <span>Advance received</span>
                  <span>{rupees(order.advance_paid)}</span>
                </div>
                <div className="sum-row total">
                  <span>Balance due</span>
                  <span>{rupees(order.balance_due)}</span>
                </div>
              </>
            )}
          </div>
          <p className="small muted">Questions? Call or WhatsApp us and quote your order number.</p>
        </div>
      )}
    </div>
  );
}
