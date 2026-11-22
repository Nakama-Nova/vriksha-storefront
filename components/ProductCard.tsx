import Link from "next/link";
import type { Product } from "@/lib/api";
import { rupees } from "@/lib/format";
import { Photo } from "./Photo";

/** `priority`: the card is in the first row, in view when the page opens, so its photo loads at once rather than lazily. */
export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const ready = !product.made_to_order && product.in_stock;
  const facts = [product.wood_type, product.category].filter(Boolean).join(" · ");
  return (
    <Link href={`/shop/${product.slug}`} className="product-card">
      <div className="pc-media">
        {/* The grid fits as many 230px+ columns as there are room for: one column on a phone, up to four on a wide screen. */}
        <Photo
          image={product.images[0] ?? product.renders[0]}
          name={product.name}
          sizes="(max-width: 520px) 100vw, (max-width: 740px) 50vw, (max-width: 1000px) 33vw, 280px"
          priority={priority}
        />
        {product.made_to_order ? (
          <span className="chip pc-badge">Made to order{product.lead_time_days ? ` · about ${product.lead_time_days} days` : ""}</span>
        ) : ready ? (
          <span className="chip ok pc-badge">Ready to ship</span>
        ) : (
          <span className="chip pc-badge">Out of stock</span>
        )}
      </div>
      <h3>{product.name}</h3>
      {facts && <p className="small muted">{facts}</p>}
      <div className="row between pc-foot">
        <span className="price">{rupees(product.price)}</span>
        <span className="pc-cta" aria-hidden="true">
          View piece →
        </span>
      </div>
    </Link>
  );
}
