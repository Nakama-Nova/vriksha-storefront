import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { DeliveryCheck } from "@/components/DeliveryCheck";
import { Customise } from "@/components/Customise";
import { ProductCard } from "@/components/ProductCard";
import { ProductQA } from "@/components/ProductQA";
import { ProductDescription } from "@/components/ProductDescription";
import { ProductGallery } from "@/components/ProductGallery";
import { TrustPoints } from "@/components/TrustPoints";
import { getCatalog, getProduct, mediaUrl, shareImageUrl } from "@/lib/api";
import { SITE_URL, whatsappUrl } from "@/lib/config";
import { describe } from "@/lib/describe";
import { rupees, sizeRows, sizeSummary } from "@/lib/format";
import { CARE, finishOptions, glance } from "@/lib/productInfo";
import { ribbonText } from "@/lib/ribbon";
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
              {ribbonText(p.ribbon) && <span className={`ribbon-chip ribbon-${p.ribbon}`}>{ribbonText(p.ribbon)}</span>}
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
          </div>
        </div>

        <section aria-label="At a glance" className="glance">
          {glance(p, desc.blocks).map((g) => (
            <div key={g.label}>
              <span className="muted small">{g.label}</span>
              <strong>{g.value}</strong>
            </div>
          ))}
        </section>

        <Customise piece={p.name} finishes={finishOptions(desc.blocks)} size={sizeLine} wood={p.wood_type} />

        <section className="detail-grid" aria-labelledby="about">
          <div className="stack" style={{ gap: 14 }}>
            <h2 id="about">About this piece</h2>
            <ProductDescription blocks={desc.blocks} hide={p.dimensions_mm ? /^dimensions/i : undefined} />
            <dl className="specs" style={{ margin: 0 }}>
              {specs.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="small muted">Wood is a natural material, so grain and colour differ from piece to piece.</p>
          </div>
          <div className="card warm stack" style={{ gap: 12, alignSelf: "start" }}>
            <h2 style={{ fontSize: "1.5rem" }}>Looking after it</h2>
            <ul className="tick">
              {CARE[p.item_type === "sculpture" ? "sculpture" : "furniture"].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="stack" aria-labelledby="buying" style={{ gap: 14 }}>
          <h2 id="buying">Delivery, payment and returns</h2>
          <ol className="how">
            <li>
              <span className="num">1</span>
              <strong>Place your order</strong>
              <span className="muted small">Nothing is charged online.</span>
            </li>
            <li>
              <span className="num">2</span>
              <strong>We call or WhatsApp you</strong>
              <span className="muted small">To confirm the price{p.made_to_order ? ", the making time" : ""} and the delivery day.</span>
            </li>
            <li>
              <span className="num">3</span>
              <strong>You pay by UPI</strong>
              <span className="muted small">{ready ? "In advance, or cash or UPI on delivery." : "An advance to begin the work."}</span>
            </li>
            <li>
              <span className="num">4</span>
              <strong>We deliver and set it up</strong>
              <span className="muted small">With our own team. Tell us within 48 hours if anything is wrong and we put it right.</span>
            </li>
          </ol>
          <p className="small muted">
            Details: <Link href="/delivery">delivery policy</Link>, <Link href="/refunds">cancellations and refunds</Link>, <Link href="/terms">terms of sale</Link>.
          </p>
        </section>

        <ProductQA product={p} />

        <div className="row">
          {ask ? (
            <a className="btn outline" href={ask} target="_blank" rel="noopener noreferrer">
              Still unsure? Ask on WhatsApp
            </a>
          ) : (
            <Link className="btn outline" href="/custom">
              Still unsure? Send us a question
            </Link>
          )}
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
