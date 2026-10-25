"use client";

// The cart lives in the browser (localStorage) and is read through React's
// useSyncExternalStore, so every component sees the same cart and tabs stay in
// sync. Prices here are only for display: the server prices the order again at
// checkout.

import { useSyncExternalStore } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  madeToOrder: boolean;
  leadTimeDays: number | null;
};

const KEY = "vriksha-cart-v1";
const MAX_QTY = 20; // same cap as the API
const EMPTY: CartItem[] = [];

let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };
const listeners = new Set<() => void>();

function read(): CartItem[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return cache.items; // storage blocked: the cart simply does not persist
  }
  if (raw === cache.raw) return cache.items; // same snapshot object while nothing changed
  let items = EMPTY;
  try {
    const parsed = JSON.parse(raw ?? "[]");
    if (Array.isArray(parsed)) items = parsed;
  } catch {}
  cache = { raw, items };
  return items;
}

function write(next: CartItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener); // another tab changed the cart
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const noopSubscribe = () => () => {};

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const cur = read();
  const found = cur.find((i) => i.slug === item.slug);
  write(
    found
      ? cur.map((i) => (i.slug === item.slug ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) } : i))
      : [...cur, { ...item, quantity: Math.min(MAX_QTY, quantity) }],
  );
}
export const setQuantity = (slug: string, quantity: number) =>
  write(read().map((i) => (i.slug === slug ? { ...i, quantity: Math.max(1, Math.min(MAX_QTY, quantity)) } : i)));
export const removeFromCart = (slug: string) => write(read().filter((i) => i.slug !== slug));
export const clearCart = () => write([]);

export function useCart() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  // false while rendering on the server / before hydration, so pages can avoid flashing "empty"
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return {
    items,
    ready,
    count: items.reduce((n, i) => n + i.quantity, 0),
    total: items.reduce((n, i) => n + i.price * i.quantity, 0),
    add: addToCart,
    setQuantity,
    remove: removeFromCart,
    clear: clearCart,
  };
}
