import type { Product } from "@/lib/api";

/** A product as the backend sends it, with sensible defaults. */
export function product(over: Partial<Product> = {}): Product {
  return {
    slug: "teak-bed",
    name: "Teak Bed",
    item_type: "furniture",
    short_desc: null,
    price: "90000.00",
    made_to_order: true,
    lead_time_days: 10,
    in_stock: true,
    wood_type: "Teak",
    dimensions_mm: null,
    category: "King Size Bed",
    images: [],
    renders: [],
    model_url: null,
    ...over,
  };
}
