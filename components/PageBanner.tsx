"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { artFor, aspect, CARVINGS } from "@/lib/art";

const GAP = 24; // px, matches .shelf ul gap
const MAX_HEIGHT = 160; // px, tallest a carving gets on a big screen
const PHONE_ROW = 2.6; // widest row (in carving heights) that still fits a phone at a readable size

/**
 * A shelf of carvings under the header on every page except the home page, which has its own hero.
 * Each carving's flex share is its aspect ratio, so they all stand at one height that scales with the
 * screen. The row is capped so they never grow past MAX_HEIGHT, and phones show only what fits.
 */
export function PageBanner() {
  const { shelf } = artFor(usePathname());
  if (!shelf.length) return null;

  let total = 0;
  const phone = new Set<string>();
  for (const name of shelf) {
    if (total && total + aspect(name) > PHONE_ROW) break;
    total += aspect(name);
    phone.add(name);
  }
  const maxWidth = shelf.reduce((w, name) => w + aspect(name) * MAX_HEIGHT, 0) + GAP * (shelf.length - 1);

  return (
    <div className="shelf" aria-hidden="true">
      <ul style={{ maxWidth }}>
        {shelf.map((name) => (
          <li key={name} className={phone.has(name) ? undefined : "extra"} style={{ flexGrow: aspect(name), flexBasis: 0 }}>
            <Image src={`/carvings/${name}.webp`} alt="" width={CARVINGS[name][0]} height={CARVINGS[name][1]} sizes="(max-width: 1200px) 33vw, 400px" />
          </li>
        ))}
      </ul>
    </div>
  );
}
