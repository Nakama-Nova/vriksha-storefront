"use client";

import NextImage from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { mediaUrl, type Image } from "@/lib/api";
import { API_URL } from "@/lib/config";
import { Photo } from "./Photo";

/**
 * Photos with thumbnails and, when the product has a .glb model, a 3D view
 * (rotate/zoom, and "view in your room" on phones). The viewer script is only
 * loaded once someone opens the 3D view.
 */
export function ProductGallery({ images, modelUrl, name }: { images: Image[]; modelUrl: string | null; name: string }) {
  const [index, setIndex] = useState(0);
  const [show3d, setShow3d] = useState(false);
  const box = useRef<HTMLDialogElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const many = images.length > 1;
  const step = (d: number) => setIndex((i) => (i + d + images.length) % images.length);

  // Left and right arrows move through the photos while one is enlarged (Escape closes it by itself)
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomed, images.length]);

  function openZoom() {
    box.current?.showModal();
    setZoomed(true);
  }
  const current = images[index];
  const src = current ? mediaUrl(current.url) : null;

  return (
    <div>
      {show3d && modelUrl ? (
        <>
          <Script
            src="https://unpkg.com/@google/model-viewer@4.0.0/dist/model-viewer.min.js"
            type="module"
            strategy="lazyOnload"
          />
          <model-viewer
            src={mediaUrl(modelUrl)}
            alt={`3D model of ${name}`}
            camera-controls=""
            auto-rotate=""
            ar=""
            shadow-intensity="1"
          />
        </>
      ) : (
        // Half the page next to the details, the full width once they stack (860px and below)
        <div className="zoomable">
          <Photo image={images[index]} name={name} sizes="(max-width: 860px) 100vw, 560px" priority />
          {src && (
            <button type="button" className="zoom-btn" onClick={openZoom} aria-label={`Enlarge photo of ${name}`}>
              <span aria-hidden="true">⤢</span> Tap to enlarge
            </button>
          )}
        </div>
      )}

      <dialog
        ref={box}
        className="lightbox"
        aria-label={`Photos of ${name}`}
        onClose={() => setZoomed(false)}
        onClick={(e) => e.target === box.current && box.current?.close()}
      >
        {zoomed && src && (
          <div className="lightbox-stage">
            <NextImage
              src={src}
              alt={current?.alt || name}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
              unoptimized={!src.startsWith(`${API_URL}/media/`)}
            />
          </div>
        )}
        <button type="button" className="lightbox-close" onClick={() => box.current?.close()} aria-label="Close">
          ✕
        </button>
        {many && (
          <>
            <button type="button" className="lightbox-nav prev" onClick={() => step(-1)} aria-label="Previous photo">
              ‹
            </button>
            <button type="button" className="lightbox-nav next" onClick={() => step(1)} aria-label="Next photo">
              ›
            </button>
            <p className="lightbox-count" aria-live="polite">
              {index + 1} / {images.length}
            </p>
          </>
        )}
      </dialog>

      {(images.length > 1 || modelUrl) && (
        <div className="thumbs">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              className="thumb"
              aria-label={`Photo ${i + 1}`}
              aria-pressed={!show3d && i === index}
              onClick={() => {
                setIndex(i);
                setShow3d(false);
              }}
            >
              <Photo image={img} name={name} sizes="84px" placeholder="" />
            </button>
          ))}
          {modelUrl && (
            <button
              type="button"
              className="btn outline"
              aria-pressed={show3d}
              onClick={() => setShow3d((s) => !s)}
              style={{ alignSelf: "center" }}
            >
              {show3d ? "Show photos" : "View in 3D"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
