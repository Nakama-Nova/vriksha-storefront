"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ApiError, subscribeNewsletter, type NewsletterSource } from "@/lib/api";

/**
 * Email sign-up. Double opt-in: the backend emails a link and the person is only on the list once they
 * click it. `dark` is for the footer. The hidden "website" field is a trap for bots; people never see it.
 */
export function NewsletterForm({ source, dark = false }: { source: NewsletterSource; dark?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const id = `news-${source}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await subscribeNewsletter(String(f.get("email") ?? "").trim(), source, String(f.get("website") ?? ""));
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <p className={`newsletter-done${dark ? " dark" : ""}`} role="status">
        Thank you. Please open the email we just sent and tap the link to confirm. If it is not in your inbox, look in spam.
      </p>
    );
  }

  return (
    <form className={`newsletter${dark ? " dark" : ""}`} onSubmit={onSubmit}>
      <div className="newsletter-row">
        <div className="field" style={{ flex: 1 }}>
          <label htmlFor={id} className="sr-only">
            Your email
          </label>
          <input id={id} name="email" type="email" className="input" required maxLength={254} autoComplete="email" placeholder="Your email" />
        </div>
        <div className="newsletter-trap" aria-hidden="true">
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button type="submit" className={`btn ${dark ? "gold" : "primary"}`} disabled={busy}>
          {busy ? "Sending…" : "Subscribe"}
        </button>
      </div>
      <p className="small newsletter-note">
        New pieces and Journal posts, now and then. Unsubscribe any time. See our <Link href="/privacy">privacy policy</Link>.
      </p>
      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
