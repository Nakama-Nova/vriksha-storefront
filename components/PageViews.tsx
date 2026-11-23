"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackView } from "@/lib/track";

/** Counts each page opened (the address only), once per visit to that page. Renders nothing. */
export function PageViews() {
  const path = usePathname();
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (last.current === path) return;
    last.current = path;
    trackView(path);
  }, [path]);
  return null;
}
