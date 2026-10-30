"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { artFor, CARVINGS } from "@/lib/art";

/** A shelf of carvings under the header on every page except the home page, which has its own hero. */
export function PageBanner() {
  const { shelf } = artFor(usePathname());
  if (!shelf.length) return null;

  return (
    <div className="shelf" aria-hidden="true">
      <ul>
        {shelf.map((name) => (
          <li key={name}>
            <Image src={`/carvings/${name}.webp`} alt="" width={CARVINGS[name][0]} height={CARVINGS[name][1]} />
          </li>
        ))}
      </ul>
    </div>
  );
}
