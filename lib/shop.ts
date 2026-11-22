// Pure helpers for browsing the catalogue: filtering, sorting and "more like this".
// No React here, so the rules are easy to read and to test.

import type { Product } from "./api";

export const SORTS = {
  name: "Name, A to Z",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
} as const;
export type SortKey = keyof typeof SORTS;
export const DEFAULT_SORT: SortKey = "name";

export const isSortKey = (v: string | null): v is SortKey => v !== null && Object.hasOwn(SORTS, v);

export type ShopFilters = {
  q: string;
  category: string | null;
  wood: string | null;
  min: number | null; // rupees
  max: number | null;
  ready: boolean; // only pieces that can go out without being made first
  sort: SortKey;
};

/** "12000" -> 12000; anything that is not a positive number -> null (the filter is ignored). */
export function parseRupees(v: string | null | undefined): number | null {
  if (!v) return null;
  const n = Number(v.replace(/[,\s₹]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

const norm = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();
const priceOf = (p: Product) => Number(p.price) || 0;

/** Ready to ship: in stock and not made to order. */
export const isReady = (p: Product) => p.in_stock && !p.made_to_order;

/** Distinct values, one spelling each (the first seen), sorted. Case differences do not make two entries. */
export function distinct(values: (string | null | undefined)[]): string[] {
  const seen = new Map<string, string>();
  for (const v of values) {
    const label = (v ?? "").trim();
    if (label && !seen.has(label.toLowerCase())) seen.set(label.toLowerCase(), label);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

export function filterAndSort(products: Product[], f: ShopFilters): Product[] {
  const needle = norm(f.q);
  const out = products.filter(
    (p) =>
      (!f.category || norm(p.category) === norm(f.category)) &&
      (!f.wood || norm(p.wood_type) === norm(f.wood)) &&
      (f.min === null || priceOf(p) >= f.min) &&
      (f.max === null || priceOf(p) <= f.max) &&
      (!f.ready || isReady(p)) &&
      (!needle || norm(`${p.name} ${p.short_desc ?? ""} ${p.wood_type ?? ""} ${p.category ?? ""}`).includes(needle)),
  );
  if (f.sort === "price-asc") out.sort((a, b) => priceOf(a) - priceOf(b) || a.name.localeCompare(b.name));
  else if (f.sort === "price-desc") out.sort((a, b) => priceOf(b) - priceOf(a) || a.name.localeCompare(b.name));
  else out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

/** How many filters (other than search and sort) are narrowing the list. */
export const activeFilterCount = (f: ShopFilters) =>
  [f.category, f.wood, f.min !== null, f.max !== null, f.ready, f.q.trim()].filter(Boolean).length;

/**
 * Pieces to show under a product: the same category first, then the same wood or kind of piece,
 * nearest in price first. Pieces with nothing in common are left out, so a shop with a single
 * category of one piece shows nothing rather than random pieces.
 */
export function relatedTo(product: Product, catalog: Product[], limit = 4): Product[] {
  const score = (p: Product) =>
    (norm(p.category) && norm(p.category) === norm(product.category) ? 2 : 0) +
    (norm(p.wood_type) && norm(p.wood_type) === norm(product.wood_type) ? 1 : 0) +
    (p.item_type === product.item_type ? 1 : 0);
  const gap = (p: Product) => Math.abs(priceOf(p) - priceOf(product));
  return catalog
    .filter((p) => p.slug !== product.slug)
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s || gap(a.p) - gap(b.p) || a.p.name.localeCompare(b.p.name))
    .slice(0, limit)
    .map(({ p }) => p);
}
