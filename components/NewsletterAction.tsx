"use client";

import Link from "next/link";
import { useState } from "react";
import { ApiError, confirmNewsletter, unsubscribeNewsletter } from "@/lib/api";

const TEXT = {
  confirm: {
    title: "Confirm your subscription",
    lead: "One tap and you are on the list for new pieces and Journal posts.",
    button: "Yes, subscribe me",
    done: "You are subscribed. Thank you! We will write to you now and then.",
  },
  unsubscribe: {
    title: "Unsubscribe",
    lead: "We are sorry to see you go. One tap and we will stop the emails.",
    button: "Unsubscribe me",
    done: "You are unsubscribed. We will not email you again.",
  },
} as const;

/**
 * The confirm and unsubscribe links in our emails open a page with a button, rather than acting on arrival,
 * because mail apps and virus scanners open links by themselves and would otherwise confirm or unsubscribe
 * people who never meant to.
 */
export function NewsletterAction({ kind, token }: { kind: "confirm" | "unsubscribe"; token: string }) {
  const t = TEXT[kind];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function run() {
    setError("");
    setBusy(true);
    try {
      await (kind === "confirm" ? confirmNewsletter(token) : unsubscribeNewsletter(token));
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card warm stack" role="status">
        <h2>{kind === "confirm" ? "Thank you" : "Done"}</h2>
        <p>{t.done}</p>
        <div className="row">
          <Link href="/journal" className="btn primary">
            Read the Journal
          </Link>
          <Link href="/shop" className="btn outline">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card stack">
      <h2>{t.title}</h2>
      <p className="muted">{t.lead}</p>
      {error && (
        <div className="alert error" role="alert">
          {error}
        </div>
      )}
      <button type="button" className="btn primary" style={{ alignSelf: "flex-start" }} onClick={run} disabled={busy}>
        {busy ? "Please wait…" : t.button}
      </button>
    </div>
  );
}
