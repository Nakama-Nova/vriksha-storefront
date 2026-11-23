"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/api";
import { rupees } from "@/lib/format";
import { activeFilterCount, DEFAULT_SORT, distinct, filterAndSort, isSortKey, isTypeKey, legacyType, parseRupees, SORTS, TYPES, type ShopFilters, type TypeKey } from "@/lib/shop";
import { ProductCard } from "./ProductCard";

/**
 * Search, kind of piece, category, wood, price, availability and sort over the whole catalogue (a small shop: done in the
 * browser). The choices live in the address (?type=furniture&sort=price-asc), so a filtered shop can be
 * shared, bookmarked, and the back button works.
 */
export function Shop({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Search is typed fast, so it is kept here and copied into the address a moment later.
  const [q, setQ] = useState(params.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // On phones the search, wood, price and sort boxes are folded away so the pieces come first
  const [toolsOpen, setToolsOpen] = useState(false);

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
  const categories = useMemo(() => distinct(products.map((p) => p.category)), [products]);
  const typeParam = params.get("type");
  const oldLink = legacyType(params.get("category"), categories);
  const filters: ShopFilters = {
    q,
    type: isTypeKey(typeParam) ? typeParam : oldLink,
    category: oldLink ? null : params.get("category"),
    wood: params.get("wood"),
    min: parseRupees(params.get("min")),
    max: parseRupees(params.get("max")),
    ready: params.get("ready") === "1",
    sort: isSortKey(sortParam) ? sortParam : DEFAULT_SORT,
  };

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
  // Only offer "Furniture / Carvings" when the shop really has both kinds
  const kinds = (Object.keys(TYPES) as TypeKey[]).filter((t) => products.some((p) => p.item_type === t));
  const showKinds = kinds.length > 1;
  const pickType = (t: TypeKey | null) => update({ type: t, category: null });

  return (
    <div className="stack" style={{ gap: 24 }}>
      {(showKinds || categories.length > 0) && (
        <div className="stack" style={{ gap: 10 }}>
          <div className="filters" role="group" aria-label="Kind of piece">
            <button className="filter" aria-pressed={!filters.type && !filters.category} onClick={() => update({ type: null, category: null })}>
              All pieces
            </button>
            {showKinds &&
              kinds.map((t) => (
                <button key={t} className="filter" aria-pressed={filters.type === t} onClick={() => pickType(t)}>
                  {TYPES[t]}
                </button>
              ))}
            {categories.map((c) => (
              <button key={c} className="filter" aria-pressed={same(filters.category, c)} onClick={() => update({ category: c, type: null })}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <button type="button" className="btn outline filters-toggle" aria-expanded={toolsOpen} aria-controls="shop-tools" onClick={() => setToolsOpen((o) => !o)}>
        {toolsOpen ? "Hide search and filters" : `Search, filters and sort${active > 0 ? ` (${active} on)` : ""}`}
      </button>
      <div id="shop-tools" className={`shop-tools${toolsOpen ? " open" : ""}`}>
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
          {shown.map((p, i) => (
            // the first row (up to four across) is in view when the page opens
            <ProductCard key={p.slug} product={p} priority={i < 4} />
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
