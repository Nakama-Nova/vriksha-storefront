"use client";

import Link from "next/link";
import { useState } from "react";
import { mediaUrl, type Product } from "@/lib/api";
import { useCart } from "@/lib/cart";

export function AddToCart({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = !product.made_to_order && !product.in_stock;
  const inCart = items.some((i) => i.slug === product.slug);

  function onAdd() {
    add({
      slug: product.slug,
      name: product.name,
      price: Number(product.price),
      image: product.images[0] ? mediaUrl(product.images[0].url) : null,
      madeToOrder: product.made_to_order,
      leadTimeDays: product.lead_time_days,
    }, qty);
    setAdded(true);
  }

  if (soldOut) {
    return (
      <div className="alert info">
        This piece is out of stock right now. <Link href="/custom">Ask us to make one</Link>.
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="row">
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" aria-label="Fewer" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span aria-live="polite">{qty}</span>
          <button type="button" aria-label="More" onClick={() => setQty((q) => Math.min(20, q + 1))}>
            +
          </button>
        </div>
        <button type="button" className="btn primary" style={{ flex: 1 }} onClick={onAdd}>
          {inCart && added ? "Added again" : "Add to cart"}
        </button>
      </div>
      <div aria-live="polite" className="small">
        {added && (
          <span>
            Added to your cart. <Link href="/cart">View cart</Link>
          </span>
        )}
      </div>
    </div>
  );
}
