// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { addToCart, clearCart, removeFromCart, setQuantity } from "@/lib/cart";

const bed = { slug: "bed", name: "Bed", price: 90000, image: null, madeToOrder: true, leadTimeDays: 10 };
const stool = { slug: "stool", name: "Stool", price: 2500, image: null, madeToOrder: false, leadTimeDays: null };
const saved = () => JSON.parse(localStorage.getItem("vriksha-cart-v1") ?? "[]") as { slug: string; quantity: number }[];

beforeEach(() => {
  clearCart();
});

describe("the cart", () => {
  it("adds a piece, and adding it again adds to the quantity", () => {
    addToCart(bed, 1);
    addToCart(bed, 2);
    addToCart(stool);
    expect(saved()).toEqual([
      expect.objectContaining({ slug: "bed", quantity: 3 }),
      expect.objectContaining({ slug: "stool", quantity: 1 }),
    ]);
  });
  it("never goes above 20 of one piece (the same cap as the server)", () => {
    addToCart(bed, 15);
    addToCart(bed, 15);
    expect(saved()[0].quantity).toBe(20);
    setQuantity("bed", 99);
    expect(saved()[0].quantity).toBe(20);
  });
  it("never goes below 1 when changing the quantity", () => {
    addToCart(bed, 3);
    setQuantity("bed", 0);
    expect(saved()[0].quantity).toBe(1);
  });
  it("removes one piece, or empties the cart", () => {
    addToCart(bed);
    addToCart(stool);
    removeFromCart("bed");
    expect(saved().map((i) => i.slug)).toEqual(["stool"]);
    clearCart();
    expect(saved()).toEqual([]);
  });
});
