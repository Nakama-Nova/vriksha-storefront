"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mediaUrl, type Product } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { rupees } from "@/lib/format";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(0); // how many were added by the last click; 0 = not yet
  const soldOut = !product.made_to_order && !product.in_stock;
  const mainButton = useRef<HTMLButtonElement>(null);
  const [passed, setPassed] = useState(false); // the main button has scrolled out of sight (above)
  const [atEnd, setAtEnd] = useState(false); // the footer is in view

  useEffect(() => {
    const btn = mainButton.current;
    if (!btn) return;
    // The sticky header covers the top ~90px, so count the button as gone once it slides under it
    const seen = new IntersectionObserver(([e]) => setPassed(!e.isIntersecting && e.boundingClientRect.top < 120), { rootMargin: "-90px 0px 0px 0px" });
    seen.observe(btn);
    const footer = document.querySelector("footer");
    const end = new IntersectionObserver(([e]) => setAtEnd(e.isIntersecting));
    if (footer) end.observe(footer);
    return () => {
      seen.disconnect();
      end.disconnect();
    };
  }, [soldOut]);

  function onAdd() {
    const photo = product.images[0] ?? product.renders[0];
    add(
      {
        slug: product.slug,
        name: product.name,
        price: Number(product.price),
        image: photo ? mediaUrl(photo.url) : null,
        madeToOrder: product.made_to_order,
        leadTimeDays: product.lead_time_days,
      },
      qty,
    );
    setAdded(qty);
  }

  if (soldOut) {
    return (
      <div className="alert info">
        This piece is out of stock right now. <Link href="/custom">Ask us to make one</Link>.
      </div>
    );
  }

  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row" style={{ flexWrap: "nowrap" }}>
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" aria-label="Fewer" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span aria-live="polite">{qty}</span>
          <button type="button" aria-label="More" onClick={() => setQty((q) => Math.min(20, q + 1))}>
            +
          </button>
        </div>
        <button ref={mainButton} type="button" className="btn primary" style={{ flex: 1 }} onClick={onAdd}>
          {added ? "Add another" : "Add to cart"}
        </button>
      </div>
      <div aria-live="polite" className="added-note">
        {added > 0 && (
          <div className="alert ok stack" style={{ gap: 10 }}>
            <span>
              ✓ {added > 1 ? `${added} added` : "Added"} to your cart. Nothing is charged until we call you to confirm.
            </span>
            <span className="row">
              <Link href="/cart" className="btn primary">
                View cart and check out
              </Link>
              <Link href="/shop" className="link-btn small">
                Keep browsing
              </Link>
            </span>
          </div>
        )}
      </div>
      {/* On phones, keep the buy button in reach once the main one has scrolled away */}
      <div className={`buybar${passed && !atEnd ? " show" : ""}`} aria-hidden={!(passed && !atEnd)}>
        <span className="buybar-info">
          <span className="small muted">{product.name}</span>
          <strong>{rupees(product.price)}</strong>
        </span>
        <button type="button" className="btn primary" tabIndex={passed && !atEnd ? 0 : -1} onClick={onAdd}>
          {added ? "Add another" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
