import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getCatalog } from "@/lib/api";
import { CARVINGS, type Carving } from "@/lib/art";

export const revalidate = 60;

const CRAFTS: { title: string; text: string; href: string; image: Carving }[] = [
  { title: "Furniture", text: "Chairs, tables, beds and storage in solid wood.", href: "/shop?category=Furniture", image: "furniture" },
  { title: "Wood carvings", text: "Wall panels, idols, door frames and decor.", href: "/shop?category=Carvings", image: "ganesha-painted" },
  { title: "Custom orders", text: "Tell us what you need. We design and build it.", href: "/custom", image: "door" },
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
            <p className="lead">Furniture for modern homes, finished with carving traditions from our ancestral craft.</p>
            <div className="row">
              <Link href="/shop" className="btn primary">
                Shop furniture
              </Link>
              <Link href="/custom" className="btn outline">
                Request a custom carving
              </Link>
            </div>
          </div>
          {/* Always the carvings: product photos belong in "Featured pieces" below, not here. */}
          <div className="hero-art">
            <Image src="/carvings/balaji.webp" alt="Lord Balaji carved in wood" width={440} height={1000} priority />
            <Image src="/carvings/ganesha-painted.webp" alt="Painted Ganesha wood carving" width={489} height={1000} priority />
          </div>
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
            <h2>Featured pieces</h2>
            <Link href="/shop" className="price">
              View all →
            </Link>
          </div>
          {products === null ? (
            <div className="alert info">Our catalogue is loading slowly. Please refresh in a moment, or call us.</div>
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
