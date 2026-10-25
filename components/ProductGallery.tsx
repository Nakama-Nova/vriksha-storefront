"use client";

import Script from "next/script";
import { useState } from "react";
import { mediaUrl, type Image } from "@/lib/api";
import { Photo } from "./Photo";

/**
 * Photos with thumbnails and, when the product has a .glb model, a 3D view
 * (rotate/zoom, and "view in your room" on phones). The viewer script is only
 * loaded once someone opens the 3D view.
 */
export function ProductGallery({ images, modelUrl, name }: { images: Image[]; modelUrl: string | null; name: string }) {
  const [index, setIndex] = useState(0);
  const [show3d, setShow3d] = useState(false);

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
        <Photo image={images[index]} name={name} priority />
      )}

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
              <Photo image={img} name={name} />
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
