import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductGallery } from "@/components/ProductGallery";
import { getProduct, mediaUrl } from "@/lib/api";
import { SITE_URL, whatsappUrl } from "@/lib/config";
import { rupees, sizeText } from "@/lib/format";

export const revalidate = 60;

export async function generateMetadata(props: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getProduct(slug);
  if (!p) return { title: "Piece not found" };
  return {
    title: p.name,
    description: p.short_desc ?? `${p.name}, handcrafted by Vriksha Studio.`,
    openGraph: { images: p.images[0] ? [mediaUrl(p.images[0].url)] : undefined },
  };
}

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const p = await getProduct(slug);
  if (!p) notFound();

  const size = sizeText(p.dimensions_mm);
  const specs: [string, string][] = [];
  if (p.wood_type) specs.push(["Wood", p.wood_type]);
  if (size) specs.push(["Size", size]);
  if (p.category) specs.push(["Category", p.category]);
  const ask = whatsappUrl(`Hello, I would like to know more about "${p.name}" (${SITE_URL}/shop/${p.slug}).`);

  // Structured data so Google can show price and availability
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.short_desc ?? undefined,
    image: p.images.map((i) => mediaUrl(i.url)),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: p.price,
      availability: p.made_to_order || p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="wrap stack" style={{ gap: 24 }}>
        <p className="small muted">
          <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {p.name}
        </p>
        <div className="product">
          <ProductGallery images={p.images} modelUrl={p.model_url} name={p.name} />
          <div className="stack" style={{ gap: 20 }}>
            {p.made_to_order && (
              <span className="chip" style={{ alignSelf: "flex-start" }}>
                Made to order{p.lead_time_days ? ` · about ${p.lead_time_days} days` : ""}
              </span>
            )}
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>{p.name}</h1>
            <p style={{ fontSize: "1.8rem", fontWeight: 600, color: "var(--brown)" }}>{rupees(p.price)}</p>
            {p.short_desc && <p className="muted">{p.short_desc}</p>}
            {specs.length > 0 && (
              <dl className="specs" style={{ margin: 0 }}>
                {specs.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <AddToCart product={p} />
            {ask ? (
              <a className="btn outline" href={ask} target="_blank" rel="noopener noreferrer">
                Ask on WhatsApp
              </a>
            ) : (
              <Link className="btn outline" href="/custom">
                Ask about this piece
              </Link>
            )}
            <div className="card warm small">
              Nothing is charged online. We confirm your order by phone or WhatsApp, then you pay an advance by UPI. Delivery by our own team in our area.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
