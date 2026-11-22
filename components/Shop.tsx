"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/api";
import { rupees } from "@/lib/format";
import { activeFilterCount, DEFAULT_SORT, distinct, filterAndSort, isSortKey, parseRupees, SORTS, type ShopFilters } from "@/lib/shop";
import { ProductCard } from "./ProductCard";

/**
 * Search, category, wood, price, availability and sort over the whole catalogue (a small shop: done in the
 * browser). The choices live in the address (?category=Furniture&sort=price-asc), so a filtered shop can be
 * shared, bookmarked, and the back button works.
 */
export function Shop({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Search is typed fast, so it is kept here and copied into the address a moment later.
  const [q, setQ] = useState(params.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  /** Change some parts of the address. A null or empty value removes that choice. */
  function update(changes: Record<string, string | null>) {
    // Read the live address, not the render's copy: a search typed a moment ago may land after another choice.
    const next = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  useEffect(() => () => clearTimeout(timer.current), []);
  function onSearch(value: string) {
    setQ(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => update({ q: value.trim() || null }), 300);
  }

  const sortParam = params.get("sort");
  const filters: ShopFilters = {
    q,
    category: params.get("category"),
    wood: params.get("wood"),
    min: parseRupees(params.get("min")),
    max: parseRupees(params.get("max")),
    ready: params.get("ready") === "1",
    sort: isSortKey(sortParam) ? sortParam : DEFAULT_SORT,
  };

  const categories = useMemo(() => distinct(products.map((p) => p.category)), [products]);
  const woods = useMemo(() => distinct(products.map((p) => p.wood_type)), [products]);
  const shown = filterAndSort(products, filters);
  const active = activeFilterCount(filters);
  const lowest = Math.min(...products.map((p) => Number(p.price) || 0));
  const highest = Math.max(...products.map((p) => Number(p.price) || 0));

  function clearAll() {
    clearTimeout(timer.current);
    setQ("");
    router.replace(filters.sort === DEFAULT_SORT ? pathname : `${pathname}?sort=${filters.sort}`, { scroll: false });
  }

  const same = (a: string | null, b: string) => a?.toLowerCase() === b.toLowerCase();

  return (
    <div className="stack" style={{ gap: 24 }}>
      {categories.length > 0 && (
        <div className="filters" role="group" aria-label="Categories">
          <button className="filter" aria-pressed={!filters.category} onClick={() => update({ category: null })}>
            All
          </button>
          {categories.map((c) => (
            <button key={c} className="filter" aria-pressed={same(filters.category, c)} onClick={() => update({ category: c })}>
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="shop-tools">
        <div className="field">
          <label htmlFor="q">Search</label>
          <input id="q" className="input" type="search" placeholder="Search pieces" value={q} onChange={(e) => onSearch(e.target.value)} />
        </div>
        {woods.length > 0 && (
          <div className="field">
            <label htmlFor="wood">Wood</label>
            <select id="wood" className="select" value={woods.find((w) => same(filters.wood, w)) ?? ""} onChange={(e) => update({ wood: e.target.value || null })}>
              <option value="">Any wood</option>
              {woods.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <span className="label" id="price-label">
            Price (₹)
          </span>
          <div className="row" style={{ gap: 8, flexWrap: "nowrap" }} role="group" aria-labelledby="price-label">
            {/* keyed on the address value, so "Clear filters" and the back button reset the boxes */}
            <input
              key={`min-${params.get("min") ?? ""}`}
              className="input"
              inputMode="numeric"
              aria-label="Lowest price"
              placeholder={Number.isFinite(lowest) ? String(Math.floor(lowest)) : "Min"}
              defaultValue={params.get("min") ?? ""}
              onBlur={(e) => update({ min: parseRupees(e.target.value) === null ? null : String(parseRupees(e.target.value)) })}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
            <span aria-hidden="true">–</span>
            <input
              key={`max-${params.get("max") ?? ""}`}
              className="input"
              inputMode="numeric"
              aria-label="Highest price"
              placeholder={Number.isFinite(highest) ? String(Math.ceil(highest)) : "Max"}
              defaultValue={params.get("max") ?? ""}
              onBlur={(e) => update({ max: parseRupees(e.target.value) === null ? null : String(parseRupees(e.target.value)) })}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" className="select" value={filters.sort} onChange={(e) => update({ sort: e.target.value === DEFAULT_SORT ? null : e.target.value })}>
            {Object.entries(SORTS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row between">
        <label className="check">
          <input type="checkbox" checked={filters.ready} onChange={(e) => update({ ready: e.target.checked ? "1" : null })} />
          Ready to ship only
        </label>
        <div className="row" style={{ gap: 14 }}>
          <p className="muted small" aria-live="polite">
            {shown.length} {shown.length === 1 ? "piece" : "pieces"}
            {filters.min !== null || filters.max !== null
              ? ` · ${filters.min !== null ? rupees(filters.min) : "any"} to ${filters.max !== null ? rupees(filters.max) : "any"}`
              : ""}
          </p>
          {active > 0 && (
            <button type="button" className="link-btn small" onClick={clearAll}>
              Clear filters ({active})
            </button>
          )}
        </div>
      </div>

      {shown.length ? (
        <div className="grid-products">
          {shown.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="alert info">
          Nothing matches.{" "}
          {active > 0 && (
            <button type="button" className="link-btn" onClick={clearAll}>
              Clear the filters
            </button>
          )}{" "}
          or ask us for a custom piece.
        </div>
      )}
    </div>
  );
}
