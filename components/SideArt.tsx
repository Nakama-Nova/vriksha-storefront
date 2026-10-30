"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { artFor } from "@/lib/art";

/** Carvings standing in the page margins, like the catalogue, facing the page. Only shown where the screen has margins. */
export function SideArt() {
  const { side } = artFor(usePathname());

  return (
    <>
      {(["left", "right"] as const).map((edge, i) => (
        <div key={edge} className={`side-art ${edge}`} aria-hidden="true">
          <Image
            src={`/carvings/${side[i].name}.webp`}
            alt=""
            fill
            sizes="300px"
            style={{ objectFit: "contain", objectPosition: "bottom", transform: side[i].flip ? "scaleX(-1)" : undefined }}
          />
        </div>
      ))}
    </>
  );
}
