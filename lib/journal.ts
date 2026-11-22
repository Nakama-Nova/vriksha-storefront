// The Journal (blog). Each post is an .mdx file in content/journal that starts with
//   export const post = { title, description, date, tags }
// The file name is the post's address: content/journal/care-for-carved-wood.mdx
// is /journal/care-for-carved-wood. Server-side only (reads the file system).

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

export type PostMeta = {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  tags?: string[];
  cover?: string; // path under /public, e.g. "/journal/teak.webp"
  coverAlt?: string;
  draft?: boolean; // drafts show in `npm run dev` only, never in production
};

export type Post = PostMeta & { slug: string; minutes: number };

const DIR = path.join(process.cwd(), "content", "journal");
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function slugs(): Promise<string[]> {
  const files = await fs.readdir(DIR).catch(() => []);
  return files.filter((f) => f.endsWith(".mdx") && SLUG.test(f.slice(0, -4))).map((f) => f.slice(0, -4));
}

async function load(slug: string): Promise<{ post: Post; Body: ComponentType } | null> {
  if (!SLUG.test(slug)) return null;
  try {
    const mod = (await import(`@/content/journal/${slug}.mdx`)) as { default: ComponentType; post: PostMeta };
    const raw = await fs.readFile(path.join(DIR, `${slug}.mdx`), "utf8");
    const words = raw.split(/\s+/).filter(Boolean).length;
    const post: Post = { ...mod.post, slug, minutes: Math.max(1, Math.round(words / 200)) };
    if (post.draft && process.env.NODE_ENV === "production") return null;
    return { post, Body: mod.default };
  } catch {
    return null;
  }
}

/** All published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const all = await Promise.all((await slugs()).map(load));
  return all
    .flatMap((p) => (p ? [p.post] : []))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** One post and its body, or null if it does not exist. */
export const getPost = load;

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
