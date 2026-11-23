"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { artFor, aspect, CARVINGS } from "@/lib/art";

const GAP = 24; // px, matches .shelf ul gap
const MAX_HEIGHT = 160; // px, tallest a carving gets on a big screen
const HIDE_ON_PHONE = ["/cart", "/checkout", "/thanks", "/track", "/comment"];

/**
 * A shelf of carvings under the header on every page except the home page, which has its own hero.
 * Each carving's flex share is its aspect ratio, so they all stand at one height that scales with the
 * screen, and the row is capped so they never grow past MAX_HEIGHT. Carvings at the ends face inward.
 */
export function PageBanner() {
  const path = usePathname();
  const { shelf } = artFor(path);
  if (!shelf.length) return null;
  // On a phone, pages where people are buying keep the content on the first screen: the shelf is hidden on the
  // cart, checkout and similar pages, and small on the shop and product pages. Wider screens are unchanged.
  const phone = HIDE_ON_PHONE.some((p) => path === p || path.startsWith(`${p}/`)) ? "hide" : path === "/shop" || path.startsWith("/shop/") ? "small" : "full";

  const maxWidth = shelf.reduce((w, { name }) => w + aspect(name) * MAX_HEIGHT, 0) + GAP * (shelf.length - 1);

  return (
    <div className="shelf" data-phone={phone} aria-hidden="true">
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
