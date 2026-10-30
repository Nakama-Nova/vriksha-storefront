"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { artFor, aspect, CARVINGS } from "@/lib/art";

const GAP = 24; // px, matches .shelf ul gap
const MAX_HEIGHT = 160; // px, tallest a carving gets on a big screen

/**
 * A shelf of carvings under the header on every page except the home page, which has its own hero.
 * Each carving's flex share is its aspect ratio, so they all stand at one height that scales with the
 * screen, and the row is capped so they never grow past MAX_HEIGHT. Carvings at the ends face inward.
 */
export function PageBanner() {
  const { shelf, corners } = artFor(usePathname());
  if (!shelf.length) return null;

  const maxWidth = shelf.reduce((w, { name }) => w + aspect(name) * MAX_HEIGHT, 0) + GAP * (shelf.length - 1);

  return (
    <div className="shelf" aria-hidden="true">
      {corners &&
        (["left", "right"] as const).map((edge) => (
          <Image
            key={edge}
            src={`/carvings/${corners}.webp`}
            alt=""
            width={CARVINGS[corners][0]}
            height={CARVINGS[corners][1]}
            className={`shelf-corner ${edge}`}
          />
        ))}
      <ul style={{ maxWidth }}>
        {shelf.map(({ name, flip }, i) => (
          <li key={i} style={{ flexGrow: aspect(name), flexBasis: 0 }}>
            <Image
              src={`/carvings/${name}.webp`}
              alt=""
              width={CARVINGS[name][0]}
              height={CARVINGS[name][1]}
              sizes="(max-width: 1200px) 33vw, 400px"
              className={flip ? "flip" : undefined}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
