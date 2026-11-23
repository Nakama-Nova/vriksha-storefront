import type { Metadata } from "next";
import { Suspense } from "react";
import { CommentForm } from "@/components/CommentForm";

export const metadata: Metadata = {
  title: "Share your experience",
  description: "Tell us and other customers how your piece and your order went.",
  robots: { index: false, follow: false },
};

export default function CommentPage() {
  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 24, maxWidth: 760 }}>
        <div className="stack">
          <span className="eyebrow">Ordered from us?</span>
          <h1>Share your experience</h1>
          <p className="muted">
            Your words help other customers. You can write once your order is confirmed. We read every comment before it appears on the website.
          </p>
        </div>
        {/* Suspense: the form reads ?order= from the address in the browser */}
        <Suspense fallback={<p className="muted">Loading…</p>}>
          <CommentForm />
        </Suspense>
      </div>
    </section>
  );
}
