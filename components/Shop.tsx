"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/api";
import { ProductCard } from "./ProductCard";

/** Search + category filter over the full catalogue (a small shop: filtered in the browser). */
export function Shop({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | null>(params.get("category"));

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter((c): c is string => !!c))).sort(),
    [products],
  );
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!category || p.category?.toLowerCase() === category.toLowerCase()) &&
        (!needle || `${p.name} ${p.short_desc ?? ""} ${p.wood_type ?? ""}`.toLowerCase().includes(needle)),
    );
  }, [products, q, category]);

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div className="row between">
        <div className="filters" role="group" aria-label="Categories">
          <button className="filter" aria-pressed={category === null} onClick={() => setCategory(null)}>
            All
          </button>
          {categories.map((c) => (
            <button key={c} className="filter" aria-pressed={category?.toLowerCase() === c.toLowerCase()} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="field" style={{ minWidth: 240 }}>
          <label htmlFor="q" className="sr-only">
            Search pieces
          </label>
          <input id="q" className="input" type="search" placeholder="Search pieces" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <p className="muted small" aria-live="polite">
        {shown.length} {shown.length === 1 ? "piece" : "pieces"}
      </p>
      {shown.length ? (
        <div className="grid-products">
          {shown.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="alert info">Nothing matches. Try a different word, or ask us for a custom piece.</div>
      )}
    </div>
  );
}
