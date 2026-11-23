import type { Metadata } from "next";
import { CommentForm } from "@/components/CommentForm";

export const metadata: Metadata = {
  title: "Share your experience",
  description: "Tell us and other customers how your piece and your order went.",
  robots: { index: false, follow: false },
};

/** The order number from the link (/comment?order=ORD-2026-0014). Anything odd is ignored. */
function orderFrom(value: string | string[] | undefined): string {
  const v = (typeof value === "string" ? value : "").trim().toUpperCase();
  return /^[A-Z0-9-]{3,40}$/.test(v) ? v : "";
}

// Read on the server and handed to the form, as the tracking page does (see app/custom/page.tsx for why).
export default async function CommentPage(props: PageProps<"/comment">) {
  const { order } = await props.searchParams;
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
        <CommentForm initial={orderFrom(order)} />
      </div>
    </section>
  );
}
