import type { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Custom orders",
  description: "Tell us what to build. Custom wood furniture and carvings, quoted before you pay anything.",
};

const STEPS = [
  ["Send your enquiry", "Photos, size and wood. Rough ideas are fine."],
  ["We quote", "A price and timeline on WhatsApp, usually after a short call."],
  ["Approve and pay an advance", "Pay the advance by UPI to start work."],
  ["We craft and deliver", "You get updates as it moves through the workshop."],
];

export default function CustomPage() {
  return (
    <>
      <section className="section warm" style={{ paddingBottom: 40 }}>
        <div className="wrap stack">
          <span className="eyebrow">Custom orders</span>
          <h1>Tell us what to build</h1>
          <p className="muted" style={{ maxWidth: "60ch" }}>
            Share your idea and a few details. We will send a quote on WhatsApp. You pay an advance only after you approve it.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="wrap two-col form-cols">
          <EnquiryForm />
          <aside className="card warm stack" aria-label="How it works">
            <h2 style={{ fontSize: "1.8rem" }}>How it works</h2>
            <ol className="steps">
              {STEPS.map(([t, d], i) => (
                <li key={t}>
                  <span className="num">{i + 1}</span>
                  <span>
                    <strong>{t}</strong>
                    <br />
                    <span className="muted small">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>
    </>
  );
}
