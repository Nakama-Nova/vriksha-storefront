import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/config";
import { formatDate, getPost, getPosts } from "@/lib/journal";

export const dynamicParams = false; // only the posts that exist are pages; anything else is a 404

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const found = await getPost(slug);
  if (!found) return { title: "Post not found" };
  const { post } = found;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage(props: PageProps<"/journal/[slug]">) {
  const { slug } = await props.params;
  const found = await getPost(slug);
  if (!found) notFound();
  const { post, Body } = found;

  // Structured data so Google can show the article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
    mainEntityOfPage: `${SITE_URL}/journal/${slug}`,
    author: { "@type": "Organization", name: "Vriksha Studio" },
    publisher: { "@type": "Organization", name: "Vriksha Studio", logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo.png` } },
  };

  return (
    <article className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="wrap stack" style={{ gap: 24, maxWidth: 760 }}>
        <p className="small muted">
          <Link href="/">Home</Link> / <Link href="/journal">Journal</Link> / {post.title}
        </p>
        <header className="stack" style={{ gap: 10 }}>
          <h1>{post.title}</h1>
          <p className="small muted">
            {formatDate(post.date)} · {post.minutes} min read
          </p>
        </header>
        {post.cover ? (
          <div className="photo post-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt={post.coverAlt ?? ""} decoding="async" />
          </div>
        ) : null}
        <div className="prose">
          <Body />
        </div>
        <div className="card warm stack" style={{ gap: 10 }}>
          <strong>Looking for a piece of your own?</strong>
          <p>Browse what we have made, or tell us what you have in mind and we will build it.</p>
          <div className="row">
            <Link className="btn primary" href="/shop">
              Browse the shop
            </Link>
            <Link className="btn outline" href="/custom">
              Ask for a custom piece
            </Link>
          </div>
        </div>
        <Link href="/journal" className="small">
          ← All posts
        </Link>
      </div>
    </article>
  );
}
