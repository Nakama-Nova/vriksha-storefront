import { SITE_URL } from "@/lib/config";
import { getPosts } from "@/lib/journal";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** RSS feed of the Journal, for readers and for sending the newsletter from new posts later. */
export async function GET() {
  const posts = await getPosts();
  const items = posts
    .map(
      (p) => `<item>
<title>${esc(p.title)}</title>
<link>${SITE_URL}/journal/${p.slug}</link>
<guid>${SITE_URL}/journal/${p.slug}</guid>
<pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
<description>${esc(p.description)}</description>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Vriksha Studio Journal</title>
<link>${SITE_URL}/journal</link>
<description>Notes from the workshop: wood, carving and made-to-order furniture.</description>
<language>en-IN</language>
${items}
</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
