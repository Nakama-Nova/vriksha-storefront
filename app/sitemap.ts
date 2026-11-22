import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/api";
import { SITE_URL } from "@/lib/config";
import { getPosts } from "@/lib/journal";

export const revalidate = 3600; // products and posts show up in the sitemap within the hour

const PAGES: [path: string, priority: number][] = [
  ["", 1],
  ["/shop", 0.9],
  ["/custom", 0.7],
  ["/journal", 0.7],
  ["/about", 0.5],
  ["/contact", 0.5],
  ["/faq", 0.4],
  ["/delivery", 0.3],
  ["/refunds", 0.3],
  ["/privacy", 0.2],
  ["/terms", 0.2],
  ["/cookies", 0.2],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [catalog, posts] = await Promise.all([getCatalog(), getPosts()]);
  return [
    ...PAGES.map(([path, priority]) => ({ url: `${SITE_URL}${path}`, priority })),
    // The catalogue is null when the shop server cannot be reached; the pages above still list.
    ...(catalog ?? []).map((p) => ({ url: `${SITE_URL}/shop/${p.slug}`, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/journal/${p.slug}`, lastModified: p.date, priority: 0.6 })),
  ];
}
