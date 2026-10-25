import type { Metadata } from "next";
import { TrackForm } from "@/components/TrackForm";

export const metadata: Metadata = { title: "Track your order" };

export default function TrackPage() {
  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 28 }}>
        <div className="stack" style={{ gap: 6 }}>
          <h1>Track your order</h1>
          <p className="muted">Enter your order number and the phone number you used.</p>
        </div>
        <TrackForm />
      </div>
    </section>
  );
}
