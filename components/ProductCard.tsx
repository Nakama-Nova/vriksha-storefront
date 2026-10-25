import Link from "next/link";
import type { Product } from "@/lib/api";
import { rupees } from "@/lib/format";
import { Photo } from "./Photo";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="product-card">
      <Photo image={product.images[0]} name={product.name} />
      {product.made_to_order ? (
        <span className="chip" style={{ alignSelf: "flex-start" }}>
          Made to order{product.lead_time_days ? ` · about ${product.lead_time_days} days` : ""}
        </span>
      ) : (
        !product.in_stock && (
          <span className="chip" style={{ alignSelf: "flex-start" }}>
            Out of stock
          </span>
        )
      )}
      <h3>{product.name}</h3>
      <span className="price">{rupees(product.price)}</span>
    </Link>
  );
}
