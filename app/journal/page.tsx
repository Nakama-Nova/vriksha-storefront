import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getPosts } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes from the workshop: choosing wood, caring for carvings, and how a made-to-order piece comes together.",
  alternates: { canonical: "/journal", types: { "application/rss+xml": "/journal/feed.xml" } },
};

export default async function JournalPage() {
  const posts = await getPosts();

  return (
    <section className="section">
      <div className="wrap stack" style={{ gap: 32 }}>
        <div className="stack" style={{ gap: 8 }}>
          <span className="eyebrow">Journal</span>
          <h1>Notes from the workshop</h1>
          <p className="muted" style={{ maxWidth: "60ch" }}>
            Choosing wood, caring for carvings, and how a made-to-order piece comes together.
          </p>
        </div>

        {posts.length ? (
          <div className="grid-posts">
            {posts.map((p) => (
              <Link key={p.slug} href={`/journal/${p.slug}`} className="post-card">
                {p.cover ? (
                  <div className="photo post-cover">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover} alt={p.coverAlt ?? ""} loading="lazy" decoding="async" />
                  </div>
                ) : null}
                <span className="small muted">
                  {formatDate(p.date)} · {p.minutes} min read
                </span>
                <h2>{p.title}</h2>
                <p className="muted">{p.description}</p>
                {p.tags?.length ? (
                  <span className="row" style={{ gap: 8 }}>
                    {p.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        ) : (
          <div className="alert info">No posts yet. Please check back soon.</div>
        )}
      </div>
    </section>
  );
}
