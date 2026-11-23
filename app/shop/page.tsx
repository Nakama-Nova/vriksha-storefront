import type { Metadata } from "next";
import { Suspense } from "react";
import { Shop } from "@/components/Shop";
import { getCatalog } from "@/lib/api";
import { CATALOGUE_NOTICE } from "@/lib/hours";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Shop",
  description: "Handcrafted wood furniture and carved art. Made to order or ready to ship in our area.",
};

export default async function ShopPage() {
  const products = await getCatalog();
  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 28 }}>
        <h1>Shop</h1>
        {products === null ? (
          <div className="alert info">{CATALOGUE_NOTICE}</div>
        ) : (
          // Suspense: Shop reads ?category= from the URL in the browser
          <Suspense fallback={<p className="muted">Loading…</p>}>
            <Shop products={products} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
