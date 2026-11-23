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

/** One short piece of text from the address (?piece=...), or empty. Anything else is ignored. */
function textFrom(value: string | string[] | undefined, max: number): string {
  return (typeof value === "string" ? value : "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max);
}

// The address is read here, on the server, and handed to the form (as the tracking page does). Reading it inside the
// form with useSearchParams left this page stuck on "Loading..." when it was built on a first visit.
export default async function CustomPage(props: PageProps<"/custom">) {
  const q = await props.searchParams;
  const start = { piece: textFrom(q.piece, 150), finish: textFrom(q.finish, 100), wood: textFrom(q.wood, 100), size: textFrom(q.size, 100) };
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
          <EnquiryForm start={start} />
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
