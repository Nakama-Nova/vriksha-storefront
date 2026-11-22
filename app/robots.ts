import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    // Private, per-customer pages are kept out of search results.
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/thanks", "/track"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
