import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { DeliveryCheck } from "@/components/DeliveryCheck";
import { ProductCard } from "@/components/ProductCard";
import { ProductDescription } from "@/components/ProductDescription";
import { ProductGallery } from "@/components/ProductGallery";
import { TrustPoints } from "@/components/TrustPoints";
import { getCatalog, getProduct, mediaUrl, shareImageUrl } from "@/lib/api";
import { SITE_URL, whatsappUrl } from "@/lib/config";
import { describe } from "@/lib/describe";
import { rupees, sizeRows, sizeSummary } from "@/lib/format";
import { relatedTo } from "@/lib/shop";

export const revalidate = 60;

/** One or two sentences for search results and link previews: the description's introduction, trimmed. */
function summary(p: { name: string; short_desc: string | null }): string {
  const text = describe(p.short_desc, p.name).intro;
  if (!text) return `${p.name}, handcrafted in solid wood by Vriksha Studio.`;
  return text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, "")}…` : text;
}

export async function generateMetadata(props: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getProduct(slug);
  if (!p) return { title: "Piece not found" };
  return {
    title: p.name,
    description: summary(p),
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: { title: p.name, description: summary(p), type: "website", url: `/shop/${p.slug}`, images: p.images[0] ?? p.renders[0] ? [shareImageUrl((p.images[0] ?? p.renders[0]).url)] : undefined },
  };
}

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const [p, catalog] = await Promise.all([getProduct(slug), getCatalog()]);
  if (!p) notFound();
  const related = catalog ? relatedTo(p, catalog) : [];

  const desc = describe(p.short_desc, p.name);
  const ready = !p.made_to_order && p.in_stock;
  const sizeLine = sizeSummary(p.dimensions_mm);
  const specs: [string, string][] = [];
  specs.push(["Type", p.item_type === "sculpture" ? "Sculpture" : "Furniture"]);
  if (p.wood_type) specs.push(["Wood", p.wood_type]);
  for (const r of sizeRows(p.dimensions_mm)) specs.push([r.label, r.value]);
  if (p.category) specs.push(["Category", p.category]);
  const ask = whatsappUrl(`Hello, I would like to know more about "${p.name}" (${SITE_URL}/shop/${p.slug}).`);

  // Structured data so Google can show price and availability
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: summary(p),
    brand: { "@type": "Brand", name: "Vriksha Studio" },
    ...(p.dimensions_mm?.l ? { depth: { "@type": "QuantitativeValue", value: p.dimensions_mm.l, unitCode: "MMT" } } : {}),
    ...(p.dimensions_mm?.w ? { width: { "@type": "QuantitativeValue", value: p.dimensions_mm.w, unitCode: "MMT" } } : {}),
    ...(p.dimensions_mm?.h ? { height: { "@type": "QuantitativeValue", value: p.dimensions_mm.h, unitCode: "MMT" } } : {}),
    url: `${SITE_URL}/shop/${p.slug}`,
    image: [...p.images, ...p.renders].map((i) => mediaUrl(i.url)),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: p.price,
      availability: p.made_to_order || p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      { "@type": "ListItem", position: 3, name: p.name, item: `${SITE_URL}/shop/${p.slug}` },
    ],
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, crumbs]).replace(/</g, "\\u003c") }} />
      <div className="wrap stack" style={{ gap: 24 }}>
        <p className="small muted">
          <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {p.name}
        </p>
        <div className="product">
          <ProductGallery images={[...p.images, ...p.renders]} modelUrl={p.model_url} name={p.name} />
          <div className="stack" style={{ gap: 18 }}>
            <div className="row" style={{ gap: 8 }}>
              {p.made_to_order && (
                <span className="chip">Made to order{p.lead_time_days ? ` · about ${p.lead_time_days} days` : ""}</span>
              )}
              {ready && <span className="chip ok">Ready to ship</span>}
              {p.wood_type && <span className="chip">{p.wood_type}</span>}
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>{p.name}</h1>
            <div className="stack" style={{ gap: 4 }}>
              <p className="price-big">{rupees(p.price)}</p>
              <p className="small muted">
                {p.made_to_order && p.lead_time_days
                  ? `Built for you in about ${p.lead_time_days} days, counted from your advance. `
                  : ""}
                Any delivery charge is told to you before you pay.
              </p>
            </div>
            {sizeLine && (
              <p className="size-line">
                <strong>Size:</strong> {sizeLine}
              </p>
            )}
            {desc.intro && <p className="lead-text">{desc.intro}</p>}
            <AddToCart product={p} />
            <DeliveryCheck />
            <TrustPoints variant="list" />
            <div className="stack" style={{ gap: 10 }}>
              {desc.blocks.length > 0 && (
                <details className="card faq" open>
                  <summary>
                    <strong>About this piece</strong>
                  </summary>
                  <div style={{ marginTop: 12 }}>
                    <ProductDescription blocks={desc.blocks} />
                  </div>
                </details>
              )}
              <details className="card faq" open={desc.blocks.length === 0}>
                <summary>
                  <strong>Specifications and size</strong>
                </summary>
                <dl className="specs" style={{ margin: "10px 0 0" }}>
                  {specs.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="small muted" style={{ marginTop: 10 }}>
                  Wood is a natural material, so grain and colour differ from piece to piece.
                </p>
              </details>
              <details className="card faq">
                <summary>
                  <strong>Delivery, returns and care</strong>
                </summary>
                <p className="small" style={{ marginTop: 10 }}>
                  We deliver with our own team in our area; see <Link href="/delivery">delivery</Link> and <Link href="/refunds">cancellations and refunds</Link>. Questions? <Link href="/faq">Read our questions and answers</Link>.
                </p>
              </details>
            </div>
            {ask ? (
              <a className="btn outline" href={ask} target="_blank" rel="noopener noreferrer">
                Ask about this piece on WhatsApp
              </a>
            ) : (
              <Link className="btn outline" href="/custom">
                Want it changed? Ask for a custom version
              </Link>
            )}
            <div className="card warm stack" style={{ gap: 12 }}>
              <h2 style={{ fontSize: "1.4rem" }}>How buying works</h2>
              <ol className="steps small">
                <li>
                  <span className="num">1</span>
                  <span>
                    <strong>Place your order.</strong> Nothing is charged online.
                  </span>
                </li>
                <li>
                  <span className="num">2</span>
                  <span>
                    <strong>We call or WhatsApp you</strong> to confirm the price and delivery day.
                  </span>
                </li>
                <li>
                  <span className="num">3</span>
                  <span>
                    <strong>You pay by UPI{ready ? ", or cash on delivery" : " (an advance to begin the work)"}.</strong> We deliver and set it up.
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </div>
        {related.length > 0 && (
          <div className="related stack" style={{ gap: 20, marginTop: 24 }}>
            <h2>More like this</h2>
            <div className="grid-products">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
