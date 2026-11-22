import Image from "next/image";
import { mediaUrl, type Image as ShopImage } from "@/lib/api";
import { API_URL } from "@/lib/config";

/**
 * Product photo, or a warm placeholder until a photo is uploaded.
 *
 * Staff upload full-size photos (about 1 MB each), so they go through next/image, which sends a resized WebP
 * of the size the screen needs. `sizes` says how wide the photo is shown at each screen width; it is what lets
 * a phone download a small copy. Always pass the one that matches where the photo is used.
 */
export function Photo({
  image,
  name,
  sizes = "100vw",
  priority,
  placeholder = "Photo coming soon",
}: {
  image?: ShopImage | null;
  name: string;
  sizes?: string;
  /** The main photo at the top of a page: load it first, not lazily. */
  priority?: boolean;
  /** Words shown until a photo is uploaded; "" for a small thumbnail where words would not fit. */
  placeholder?: string;
}) {
  const src = image ? mediaUrl(image.url) : null;
  return (
    <div className="photo">
      {src ? (
        <Image
          src={src}
          alt={image?.alt || name}
          fill
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          // A photo from anywhere but the shop's server (an old cart entry, say) cannot be optimised: show it as it is.
          unoptimized={!src.startsWith(`${API_URL}/media/`)}
        />
      ) : (
        <span aria-hidden="true">{placeholder}</span>
      )}
    </div>
  );
}
