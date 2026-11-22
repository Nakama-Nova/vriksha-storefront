"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section">
      <div className="wrap stack" style={{ alignItems: "flex-start" }}>
        <h1>Something went wrong</h1>
        <p className="muted">Please try again. If it keeps happening, call or message us and we will help.</p>
        <div className="row">
          <button type="button" className="btn primary" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn outline">
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
