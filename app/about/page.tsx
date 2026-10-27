import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Vriksha Studio carries forward a family tradition of hand-carved wood, from temple replicas to furniture.",
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 32, maxWidth: 820 }}>
        <div className="stack">
          <span className="eyebrow">Our roots</span>
          <h1>A family tradition in wooden craft</h1>
          <p className="muted">
            Vriksha Studio grew out of a family of wood carvers. Our founder&apos;s grandfather, M. Subramani Achari of Puthur, was a maker of
            quality wooden carving, with temple replicas among his work.
          </p>
        </div>

        {/* TODO owner: add the year he started and where his workshop was, once confirmed. */}

        <figure className="stack" style={{ margin: 0, gap: 12 }}>
          <Image
            src="/about/subramani-achary-souvenir-1983.png"
            alt="Advertisement reading: With Best Compliments From Mr. M. Subramani Achary, Puthur. Makers of quality wooden carving (temple replicas)."
            width={935}
            height={705}
            sizes="(max-width: 820px) 100vw, 820px"
            style={{ width: "100%", height: "auto", border: "1px solid var(--line)", borderRadius: "var(--radius)" }}
          />
          <figcaption className="small muted">
            From the Silver Jubilee Souvenir of the Victoria Technical Institute Staff Recreation Club, Madras, 28 August 1983. The name is
            printed there as &ldquo;Mr. M. Subramani Achary&rdquo;.
          </figcaption>
        </figure>

        <div className="card warm stack">
          <h2>Carrying it forward</h2>
          <p>
            We still hold to the line his advertisement carried: quality wooden carving. Today that work takes the form of furniture and
            carved art from our own workshops, and custom pieces made to your idea.
          </p>
          <div className="row">
            <Link href="/shop" className="btn primary">
              Browse the shop
            </Link>
            <Link href="/custom" className="btn outline">
              Ask for a custom piece
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
