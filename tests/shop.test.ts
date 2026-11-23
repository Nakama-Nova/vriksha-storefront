import { describe, expect, it } from "vitest";
import {
  activeFilterCount,
  categoryGroup,
  DEFAULT_SORT,
  distinct,
  filterAndSort,
  legacyType,
  parseRupees,
  relatedTo,
  type ShopFilters,
} from "@/lib/shop";
import { product } from "./fixtures";

const none: ShopFilters = { q: "", type: null, category: null, wood: null, min: null, max: null, ready: false, sort: DEFAULT_SORT };

const king = product({ slug: "king", name: "King Bed", price: "110330.00", category: "King Size Bed" });
const queen = product({ slug: "queen", name: "Queen Bed", price: "90860.00", category: "Queen Size bed" });
const idol = product({
  slug: "ganesha",
  name: "Ganesha Panel",
  price: "12000.00",
  item_type: "sculpture",
  category: "Wall Panel",
  wood_type: "Rosewood",
  made_to_order: false,
  in_stock: true,
});
const all = [king, queen, idol];

describe("category grouping", () => {
  it("puts every kind of bed under one Beds filter and leaves other names alone", () => {
    expect(categoryGroup("King Size Bed")).toBe("Beds");
    expect(categoryGroup("Queen Size bed")).toBe("Beds");
    expect(categoryGroup("Bed")).toBe("Beds");
    expect(categoryGroup("Bedside Table")).toBe("Bedside Table");
    expect(categoryGroup("Wall Panel")).toBe("Wall Panel");
    expect(categoryGroup(null)).toBeNull();
    expect(categoryGroup("  ")).toBeNull();
  });
  it("still finds a piece by its exact old category or by the group", () => {
    expect(filterAndSort(all, { ...none, category: "Beds" }).map((p) => p.slug).sort()).toEqual(["king", "queen"]);
    expect(filterAndSort(all, { ...none, category: "King Size Bed" }).map((p) => p.slug)).toEqual(["king"]);
  });
});

describe("old links", () => {
  it("?category=Furniture and Carvings mean a kind of piece when no real category has that name", () => {
    expect(legacyType("Furniture", ["Beds"])).toBe("furniture");
    expect(legacyType("Carvings", ["Beds"])).toBe("sculpture");
    expect(legacyType("carving", [])).toBe("sculpture");
  });
  it("a real category with that name wins, and unknown names are not guessed", () => {
    expect(legacyType("Furniture", ["Furniture"])).toBeNull();
    expect(legacyType("Sofas", [])).toBeNull();
    expect(legacyType(null, [])).toBeNull();
  });
});

describe("filtering and sorting", () => {
  it("filters by kind, wood, price and ready-to-ship", () => {
    expect(filterAndSort(all, { ...none, type: "sculpture" }).map((p) => p.slug)).toEqual(["ganesha"]);
    expect(filterAndSort(all, { ...none, wood: "rosewood" }).map((p) => p.slug)).toEqual(["ganesha"]);
    expect(filterAndSort(all, { ...none, min: 100000 }).map((p) => p.slug)).toEqual(["king"]);
    expect(filterAndSort(all, { ...none, max: 100000 }).map((p) => p.slug).sort()).toEqual(["ganesha", "queen"]);
    expect(filterAndSort(all, { ...none, ready: true }).map((p) => p.slug)).toEqual(["ganesha"]);
  });
  it("searches the name, description, wood and category, ignoring case", () => {
    expect(filterAndSort(all, { ...none, q: "GANESHA" }).map((p) => p.slug)).toEqual(["ganesha"]);
    expect(filterAndSort(all, { ...none, q: "rosewood" }).map((p) => p.slug)).toEqual(["ganesha"]);
    expect(filterAndSort(all, { ...none, q: "nothing like this" })).toEqual([]);
  });
  it("sorts by name, and by price either way", () => {
    expect(filterAndSort(all, none).map((p) => p.slug)).toEqual(["ganesha", "king", "queen"]);
    expect(filterAndSort(all, { ...none, sort: "price-asc" }).map((p) => p.slug)).toEqual(["ganesha", "queen", "king"]);
    expect(filterAndSort(all, { ...none, sort: "price-desc" }).map((p) => p.slug)).toEqual(["king", "queen", "ganesha"]);
  });
  it("counts the filters that narrow the list (not sort)", () => {
    expect(activeFilterCount(none)).toBe(0);
    expect(activeFilterCount({ ...none, type: "furniture", ready: true, min: 1 })).toBe(3);
  });
});

describe("small helpers", () => {
  it("reads rupee amounts people type", () => {
    expect(parseRupees("12,000")).toBe(12000);
    expect(parseRupees("₹ 500")).toBe(500);
    expect(parseRupees("")).toBeNull();
    expect(parseRupees("abc")).toBeNull();
    expect(parseRupees("-5")).toBeNull();
  });
  it("lists each category once, whatever the capital letters", () => {
    expect(distinct(["Beds", "beds", null, "  ", "Chairs"])).toEqual(["Beds", "Chairs"]);
  });
  it("suggests pieces with something in common, never the piece itself or strangers", () => {
    expect(relatedTo(king, all).map((p) => p.slug)).toEqual(["queen"]); // same kind and wood; the idol shares nothing
    expect(relatedTo(king, [king])).toEqual([]);
  });
});
