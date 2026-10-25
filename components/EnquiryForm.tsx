"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ApiError, sendEnquiry, type PublicOrder } from "@/lib/api";
import { PHONE, whatsappUrl } from "@/lib/config";

export function EnquiryForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<PublicOrder | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const text = (k: string) => String(f.get(k) ?? "").trim();
    setBusy(true);
    try {
      setDone(
        await sendEnquiry({
          name: text("name"),
          phone: text("phone"),
          what: text("what"),
          description: text("description"),
          wood: text("wood") || undefined,
          size: text("size") || undefined,
          budget: text("budget") || undefined,
        }),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    const wa = whatsappUrl(`Hello, I sent a custom order enquiry (${done.order_number}).`);
    return (
      <div className="card warm stack" role="status">
        <h2>Thank you, we have your enquiry.</h2>
        <p>
          Your reference is <strong>{done.order_number}</strong>. We will send a quote on WhatsApp
          {PHONE ? ` or call you on the number you gave` : ""}. You pay an advance only after you approve it.
        </p>
        <div className="row">
          <Link href="/track" className="btn primary">
            Track this enquiry
          </Link>
          {wa && (
            <a href={wa} className="btn outline" target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <form className="card stack" onSubmit={onSubmit} style={{ gap: 18 }}>
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
        <label htmlFor="what">What would you like made?</label>
        <input id="what" name="what" className="input" required minLength={2} maxLength={200} placeholder="e.g. Temple door frame, dining table, wall panel" />
      </div>
      <div className="grid2">
        <div className="field">
          <label htmlFor="wood">Wood preference</label>
          <input id="wood" name="wood" className="input" maxLength={100} placeholder="Teak, rosewood, sheesham, not sure" />
        </div>
        <div className="field">
          <label htmlFor="size">Approx. size (L × W × H, mm)</label>
          <input id="size" name="size" className="input" maxLength={100} placeholder="e.g. 1200 × 600 × 750" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="description">Describe your idea</label>
        <textarea id="description" name="description" className="textarea" required minLength={5} maxLength={2000} placeholder="Style, motifs, where it will be used, anything that matters to you" />
      </div>
      <div className="field">
        <label htmlFor="budget">Budget (optional)</label>
        <input id="budget" name="budget" className="input" maxLength={100} placeholder="Approximate range in ₹" />
      </div>
      <p className="small muted">Have photos or a sketch? Send them on WhatsApp after you submit and quote your reference number.</p>
      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}
      <button type="submit" className="btn primary block" disabled={busy}>
        {busy ? "Sending…" : "Send enquiry"}
      </button>
      <p className="small muted">We use your number only to reply about this enquiry.</p>
    </form>
  );
}
