import { mediaUrl, type Image } from "@/lib/api";

/** Product photo, or a warm placeholder until a photo is uploaded. */
export function Photo({ image, name, priority }: { image?: Image | null; name: string; priority?: boolean }) {
  return (
    <div className="photo">
      {image ? (
        // Plain <img>: photos come from the shop server, already resized by staff.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaUrl(image.url)}
          alt={image.alt || name}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <span aria-hidden="true">Photo coming soon</span>
      )}
    </div>
  );
}
