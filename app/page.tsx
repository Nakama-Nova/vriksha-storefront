import Image from "next/image";
import Link from "next/link";
import { FeatureBanner } from "@/components/FeatureBanner";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { TrustPoints } from "@/components/TrustPoints";
import { getCatalog } from "@/lib/api";
import { CARVINGS, type Carving } from "@/lib/art";
import { CATALOGUE_NOTICE } from "@/lib/hours";

export const revalidate = 60;

const CRAFTS: { title: string; text: string; href: string; image: Carving }[] = [
  { title: "Furniture", text: "Chairs, tables, beds and storage in solid wood.", href: "/shop?type=furniture", image: "furniture" },
  { title: "Wood carvings", text: "Wall panels, idols, door frames and decor.", href: "/shop?type=sculpture", image: "ganesha-painted" },
  { title: "Custom orders", text: "Tell us what you need. We design and build it.", href: "/custom", image: "door" },
];

const HOW: [string, string][] = [
  ["Choose or describe", "Add a piece to your cart, or send us your idea for a custom one."],
  ["We call you", "We confirm the price, the wood and the delivery day with you."],
  ["Pay by UPI", "An advance for made-to-order pieces. Pieces in stock can be paid on delivery."],
  ["We craft and deliver", "Our own team brings it to your door and sets it up."],
];

export default async function Home() {
  const products = await getCatalog();
  const featured = (products ?? []).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="stack" style={{ gap: 22 }}>
            <span className="eyebrow">Handcrafted wood furniture &amp; carvings</span>
            <h1>Wood that remembers the hands that shaped it.</h1>
            <p className="lead">
              Solid-wood furniture and carved temple art, crafted in our own workshop. Choose a piece you love, or tell us what you have in mind and we will build it.
            </p>
            <div className="row">
              <Link href="/shop" className="btn primary">
                Browse the collection
              </Link>
              <Link href="/custom" className="btn outline">
                Request a custom piece
              </Link>
            </div>
            <p className="small muted">Nothing to pay online. We call you to confirm before you pay anything.</p>
          </div>
          {/* Always the carvings: product photos belong in "Featured pieces" below, not here. */}
          <div className="hero-art">
            <Image src="/carvings/balaji.webp" alt="Lord Balaji carved in wood" width={440} height={1000} priority />
            <Image src="/carvings/ganesha-painted.webp" alt="Painted Ganesha wood carving" width={489} height={1000} priority />
          </div>
        </div>
      </section>

      <FeatureBanner />

      <section className="trust-strip" aria-label="Why buy from us">
        <div className="wrap">
          <TrustPoints />
        </div>
      </section>

      <section className="section">
        <div className="wrap stack" style={{ gap: 28 }}>
          <h2>Shop by craft</h2>
          <div className="cats">
            {CRAFTS.map((c) => (
              <Link key={c.title} href={c.href} className="card warm stack" style={{ textDecoration: "none" }}>
                <div className="card-img" aria-hidden="true">
                  <Image src={`/carvings/${c.image}.webp`} alt="" width={CARVINGS[c.image][0]} height={CARVINGS[c.image][1]} />
                </div>
                <h3>{c.title}</h3>
                <p className="muted">{c.text}</p>
                <span className="price">Browse →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap stack" style={{ gap: 28 }}>
          <div className="row between">
            <h2>Pieces from our workshop</h2>
            <Link href="/shop" className="price">
              See everything →
            </Link>
          </div>
          {products === null ? (
            <div className="alert info">{CATALOGUE_NOTICE}</div>
          ) : featured.length ? (
            <div className="grid-products">
              {featured.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <div className="alert info">New pieces are being photographed. Meanwhile, tell us what you would like made.</div>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="workshop">
        <div className="wrap workshop">
          <div className="stack" style={{ gap: 16 }}>
            <span className="eyebrow">Our workshop</span>
            <h2 id="workshop">Made by a family of wood carvers</h2>
            <p>
              Vriksha Studio grew out of a family of wood carvers. Our founder&apos;s grandfather, M. Subramani Achari of Puthur, made quality
              wooden carving, temple replicas among it. We still hold to that line today, in furniture and carved art from our own workshop.
            </p>
            <ul className="tick">
              <li>You see the price and the making time before you pay anything.</li>
              <li>Pieces are made to order, so you can ask for another size, wood or finish.</li>
              <li>Our own team delivers and sets it up.</li>
            </ul>
            <div className="row">
              <Link href="/about" className="btn outline">
                Read our story
              </Link>
              <Link href="/custom" className="btn primary">
                Ask for a custom piece
              </Link>
            </div>
          </div>
          {/* TODO owner: put a photo of the workshop and the people in it here (public/workshop/) once taken. */}
          <figure className="workshop-fig">
            <Image
              src="/about/subramani-achary-souvenir-1983.png"
              alt="A 1983 advertisement: With Best Compliments From Mr. M. Subramani Achary, Puthur. Makers of quality wooden carving (temple replicas)."
              width={935}
              height={705}
              sizes="(max-width: 860px) 100vw, 520px"
            />
            <figcaption className="small muted">The family&apos;s own advertisement, Madras, 1983.</figcaption>
          </figure>
        </div>
      </section>

      <Testimonials />

      <section className="section warm" aria-labelledby="how">
        <div className="wrap stack" style={{ gap: 28 }}>
          <div className="stack" style={{ gap: 8 }}>
            <h2 id="how">How an order works</h2>
            <p className="muted" style={{ maxWidth: "60ch" }}>
              No online payment, no surprises. A real person talks to you before any money changes hands.
            </p>
          </div>
          <ol className="how">
            {HOW.map(([title, text], i) => (
              <li key={title}>
                <span className="num">{i + 1}</span>
                <strong>{title}</strong>
                <span className="muted small">{text}</span>
              </li>
            ))}
          </ol>
          <div className="row">
            <Link href="/shop" className="btn primary">
              Start with the collection
            </Link>
            <Link href="/faq" className="btn outline">
              Read common questions
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="card warm stack" style={{ gap: 12, maxWidth: 640 }}>
            <h2>Notes from the workshop</h2>
            <p className="muted">New pieces, wood and care advice, and how custom orders come together. A short email now and then.</p>
            <NewsletterForm source="home" />
            <Link href="/journal" className="small">
              Or read the Journal →
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <div className="stack">
            <h2>Have a design in mind?</h2>
            <p>Send us a sketch or a photo. We quote, you approve, we build.</p>
          </div>
          <Link href="/custom" className="btn gold">
            Request a custom piece
          </Link>
        </div>
      </section>
    </>
  );
}
