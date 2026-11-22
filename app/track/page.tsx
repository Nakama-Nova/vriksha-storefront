import type { Metadata } from "next";
import { TrackForm } from "@/components/TrackForm";

// Order numbers are in the address (the link in our order emails), so keep these pages out of search.
export const metadata: Metadata = { title: "Track your order", robots: { index: false, follow: false } };

/** The order number from the link in our emails (/track?order=ORD-2026-0014). Anything odd is ignored. */
function orderFrom(value: string | string[] | undefined): string {
  const v = (typeof value === "string" ? value : "").trim().toUpperCase();
  return /^[A-Z0-9-]{3,40}$/.test(v) ? v : "";
}

export default async function TrackPage(props: PageProps<"/track">) {
  const { order } = await props.searchParams;
  const number = orderFrom(order);

  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 28 }}>
        <div className="stack" style={{ gap: 6 }}>
          <h1>Track your order</h1>
          <p className="muted">
            {number ? "Enter the phone number you ordered with to see where your order is." : "Enter your order number and the phone number you used."}
          </p>
        </div>
        <TrackForm initialNumber={number} />
      </div>
    </section>
  );
}
