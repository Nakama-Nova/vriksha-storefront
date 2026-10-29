import Link from "next/link";
import type { ReactNode } from "react";
import { POLICY, POLICY_LINKS, SHOP } from "@/lib/legal";

/** The frame every policy page shares: title, date, the page itself, and links to the others. */
export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <section className="section">
      <div className="wrap legal stack" style={{ gap: 20, maxWidth: 760 }}>
        <div className="stack" style={{ gap: 8 }}>
          <h1>{title}</h1>
          <p className="small muted">Last updated {POLICY.updated}</p>
          <p className="muted">{intro}</p>
        </div>
        {children}
        <div className="card warm stack" style={{ gap: 6 }}>
          <strong>Questions about this page?</strong>
          <p>
            Write to <a href={`mailto:${SHOP.email}`}>{SHOP.email}</a>
            {SHOP.phone ? (
              <>
                {" "}
                or call <a href={`tel:${SHOP.phone.replace(/\s/g, "")}`}>{SHOP.phone}</a>
              </>
            ) : null}
            .
          </p>
          {SHOP.address && <p className="small muted">{SHOP.name}, {SHOP.address}</p>}
        </div>
        <nav aria-label="Policies" className="row small" style={{ gap: 16, flexWrap: "wrap" }}>
          {POLICY_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
