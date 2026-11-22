import Link from "next/link";
import type { Product } from "@/lib/api";
import { rupees } from "@/lib/format";
import { Photo } from "./Photo";

export function ProductCard({ product }: { product: Product }) {
  const ready = !product.made_to_order && product.in_stock;
  const facts = [product.wood_type, product.category].filter(Boolean).join(" · ");
  return (
    <Link href={`/shop/${product.slug}`} className="product-card">
      <div className="pc-media">
        <Photo image={product.images[0] ?? product.renders[0]} name={product.name} />
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
