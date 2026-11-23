"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApiError, sendComment } from "@/lib/api";
import { trackEvent } from "@/lib/track";
import { ErrorSummary, FieldError, fieldA11y, useFieldErrors, useHydrated } from "./FormErrors";
import { check, pickFields, rules } from "@/lib/formErrors";

const MAX = 800;
const ORDER = ["number", "phone", "name", "comment", "consent"];
const LABELS: Record<string, string> = { number: "Order number", phone: "Phone number", name: "Name to show", comment: "Your comment", consent: "Permission to show it" };
const RULES = {
  number: [rules.required("Enter your order number, like ORD-2026-0014")],
  phone: [rules.mobile("Enter the 10-digit mobile number you ordered with")],
  name: [rules.minLength(2, "Enter the name to show, like Ravi K.")],
  comment: [rules.minLength(10, "Write at least 10 characters")],
  consent: [rules.ticked("Tick the box to let us show your comment")],
};
// The server's names for these fields
const SERVER_NAMES: Record<string, string> = { order_number: "number", display_name: "name", text: "comment" };

/** A customer's comment. Needs the order number and the phone it was placed with, the same as tracking. */
export function CommentForm() {
  const params = useSearchParams();
  const initial = (params.get("order") ?? "").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 40);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { errors, setErrors, onInput, show } = useFieldErrors(ORDER);
  const hydrated = useHydrated();
  const [done, setDone] = useState(false);
  const [length, setLength] = useState(0);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    const found = check(f, RULES);
    if (Object.keys(found).length) return show(found);
    setErrors({});
    const text = (k: string) => String(f.get(k) ?? "").trim();
    setBusy(true);
    try {
      await sendComment({
        order_number: text("number"),
        phone: text("phone"),
        display_name: text("name"),
        place: text("place") || undefined,
        text: text("comment"),
        consent: f.get("consent") === "on",
        website: text("website"),
      });
      setDone(true);
      trackEvent("comment_sent");
    } catch (err) {
      const fromServer = err instanceof ApiError ? pickFields(err.fields, SERVER_NAMES) : {};
      const mine = Object.fromEntries(Object.entries(fromServer).filter(([k]) => ORDER.includes(k)));
      if (Object.keys(mine).length) {
        show(mine);
      } else {
        setError(
          err instanceof ApiError && err.status === 404
            ? "We could not find that order. Check the order number and the phone number you used."
            : err instanceof ApiError
              ? err.message
              : "Something went wrong. Please try again.",
        );
      }
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card warm stack" role="status">
        <h2>Thank you!</h2>
        <p>We have your comment. We read every one before it appears on the website, so it may take a little while.</p>
        <div className="row">
          <Link href="/shop" className="btn primary">
            Back to the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="card stack" onSubmit={onSubmit} onInput={onInput} noValidate style={{ gap: 18 }}>
      <ErrorSummary errors={errors} labels={LABELS} order={ORDER} />
      <div className="grid2">
        <div className="field">
          <label htmlFor="number">Order number</label>
          <input id="number" name="number" className="input" required placeholder="e.g. ORD-2026-0014" autoCapitalize="characters" defaultValue={initial} {...fieldA11y("number", errors)} />
          <FieldError name="number" errors={errors} />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number you ordered with</label>
          <input id="phone" name="phone" className="input" type="tel" inputMode="tel" required autoComplete="tel" autoFocus={initial !== ""} {...fieldA11y("phone", errors)} />
          <FieldError name="phone" errors={errors} />
        </div>
      </div>
      <div className="grid2">
        <div className="field">
          <label htmlFor="name">Name to show</label>
          <input id="name" name="name" className="input" required minLength={2} maxLength={60} placeholder="First name and initial, e.g. Ravi K." autoComplete="off" {...fieldA11y("name", errors)} />
          <FieldError name="name" errors={errors} />
        </div>
        <div className="field">
          <label htmlFor="place">Town (optional)</label>
          <input id="place" name="place" className="input" maxLength={60} autoComplete="off" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="comment">Your comment</label>
        <textarea
          id="comment"
          name="comment"
          className="textarea"
          required
          minLength={10}
          maxLength={MAX}
          placeholder="How was your piece, and how was the buying and delivery?"
          onChange={(e) => setLength(e.target.value.length)}
          {...fieldA11y("comment", errors, "comment-count")}
        />
        <FieldError name="comment" errors={errors} />
        <p id="comment-count" className="small muted">
          {length} / {MAX}
        </p>
      </div>
      <label className="check" style={{ alignItems: "flex-start" }}>
        <input id="consent" type="checkbox" name="consent" required {...fieldA11y("consent", errors)} />
        <span>
          You may show my comment, with the name and town above, on the Vriksha Studio website. I can ask you to remove it. See our <Link href="/privacy">privacy policy</Link>.
        </span>
      </label>
      <FieldError name="consent" errors={errors} />
      {/* A trap for bots: out of sight and out of the tab order */}
      <div className="newsletter-trap" aria-hidden="true">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}
      <button type="submit" className="btn primary block" disabled={busy || !hydrated}>
        {busy ? "Sending…" : "Send my comment"}
      </button>
      <p className="small muted">We check the order number and phone only to make sure you are a customer. Nothing else about your order is shown.</p>
    </form>
  );
}
