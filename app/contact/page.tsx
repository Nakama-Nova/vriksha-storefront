import type { Metadata } from "next";
import Link from "next/link";
import { PHONE, WHATSAPP, whatsappUrl } from "@/lib/config";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const wa = whatsappUrl("Hello, I would like to know more about your furniture.");
  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 24, maxWidth: 720 }}>
        <h1>Contact us</h1>
        <p className="muted">Visit the workshop, call, or message us. We are happy to talk through an idea before you order.</p>
        <div className="card warm stack">
          {PHONE && (
            <p>
              <strong>Phone:</strong> <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
            </p>
          )}
          {WHATSAPP && wa && (
            <p>
              <strong>WhatsApp:</strong>{" "}
              <a href={wa} target="_blank" rel="noopener noreferrer">
                +{WHATSAPP}
              </a>
            </p>
          )}
          {!PHONE && !WHATSAPP && <p>Our phone and WhatsApp numbers will appear here soon. Until then, send us an enquiry and we will reply.</p>}
        </div>
        <div className="row">
          <Link href="/custom" className="btn primary">
            Send an enquiry
          </Link>
          <Link href="/shop" className="btn outline">
            Browse the shop
          </Link>
        </div>
      </div>
    </section>
  );
}
