"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { artFor } from "@/lib/art";

/** Carvings standing in the page margins, like the catalogue. Only shown where the screen is wide enough to have margins. */
export function SideArt() {
  const { side } = artFor(usePathname());

  return (
    <>
      {(["left", "right"] as const).map((edge, i) => (
        <div key={edge} className={`side-art ${edge}`} aria-hidden="true">
          <Image src={`/carvings/${side[i]}.webp`} alt="" fill sizes="300px" style={{ objectFit: "contain", objectPosition: "bottom" }} />
        </div>
      ))}
    </>
  );
}
