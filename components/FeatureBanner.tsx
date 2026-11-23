import Link from "next/link";
import { getBanner } from "@/lib/api";
import { BannerMedia } from "./BannerMedia";

/** The feature banner under the home page's top section. Shows nothing while staff have none switched on. */
export async function FeatureBanner() {
  const b = await getBanner();
  if (!b) return null;
  const hasMedia = b.media_kind !== "none" && (b.image_url || b.embed_url);
  const button = b.button_url ? (
    b.button_url.startsWith("/") ? (
      <Link href={b.button_url} className="btn primary">
        {b.button_label || "Learn more"}
      </Link>
    ) : (
      <a href={b.button_url} className="btn primary" rel="noopener noreferrer">
        {b.button_label || "Learn more"}
      </a>
    )
  ) : null;

  return (
    <section className="section" aria-labelledby="feature" style={{ paddingBottom: 0 }}>
      <div className={`wrap feature${hasMedia ? " with-media" : ""}`}>
        {hasMedia && (
          <BannerMedia
            kind={b.media_kind as "image" | "youtube" | "instagram"}
            imageUrl={b.image_url}
            embedUrl={b.embed_url}
            watchUrl={b.watch_url}
            title={b.headline}
          />
        )}
        <div className="stack" style={{ gap: 14 }}>
          <h2 id="feature">{b.headline}</h2>
          {b.body && <p className="lead-text">{b.body}</p>}
          {button && <div className="row">{button}</div>}
        </div>
      </div>
    </section>
  );
}
