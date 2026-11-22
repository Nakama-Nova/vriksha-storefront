import Link from "next/link";
import type { Product } from "@/lib/api";
import { rupees } from "@/lib/format";
import { Photo } from "./Photo";

/** `priority`: the card is in the first row, in view when the page opens, so its photo loads at once rather than lazily. */
export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  return (
    <Link href={`/shop/${product.slug}`} className="product-card">
      {/* The grid fits as many 230px+ columns as there are room for: one column on a phone, up to four on a wide screen. */}
      <Photo
        image={product.images[0] ?? product.renders[0]}
        name={product.name}
        sizes="(max-width: 520px) 100vw, (max-width: 740px) 50vw, (max-width: 1000px) 33vw, 280px"
        priority={priority}
      />
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
