"use client";

import Image from "next/image";
import { useState } from "react";
import { mediaUrl } from "@/lib/api";
import { API_URL } from "@/lib/config";

// Only these two players may ever be put in a frame (the page's security policy says the same).
const PLAYERS = ["https://www.youtube-nocookie.com/embed/", "https://www.instagram.com/"];

type Props = {
  kind: "image" | "youtube" | "instagram";
  imageUrl: string | null;
  embedUrl: string | null;
  watchUrl: string | null;
  title: string;
};

/**
 * The banner's picture or video. A video shows a play button only: nothing is loaded from YouTube or Instagram until the
 * visitor presses it, which keeps the page fast and keeps the promise that we do not track visitors on their own.
 */
export function BannerMedia({ kind, imageUrl, embedUrl, watchUrl, title }: Props) {
  const [playing, setPlaying] = useState(false);

  if (kind === "image" && imageUrl) {
    const src = mediaUrl(imageUrl);
    return (
      <div className="banner-media banner-image">
        <Image src={src} alt={title} fill sizes="(max-width: 860px) 100vw, 560px" style={{ objectFit: "cover" }} unoptimized={!src.startsWith(`${API_URL}/media/`)} />
      </div>
    );
  }

  const allowed = embedUrl && PLAYERS.some((p) => embedUrl.startsWith(p));
  if (!allowed) return null;
  const vertical = kind === "instagram";
  const name = kind === "youtube" ? "YouTube" : "Instagram";
  const src = playing ? (kind === "youtube" ? `${embedUrl}&autoplay=1` : embedUrl) : null;

  return (
    <div className={`banner-media banner-video${vertical ? " vertical" : ""}`}>
      {src ? (
        <iframe
          src={src}
          title={`${title} (${name} video)`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      ) : (
        <div className="banner-poster">
          <button type="button" className="banner-play" onClick={() => setPlaying(true)} aria-label={`Play the ${kind === "instagram" ? "reel" : "video"}: ${title}`}>
            <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </button>
          <p className="small">Plays from {name} when you press play.</p>
          {watchUrl && (
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="small">
              Open on {name}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
