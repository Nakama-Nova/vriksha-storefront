"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackEvent, trackView } from "@/lib/track";

/**
 * Counts each page opened (the address only), once per visit to that page, and taps on the WhatsApp button
 * (one listener for the whole page, so the button itself can stay a plain server component). Renders nothing.
 */
export function PageViews() {
  const path = usePathname();
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (last.current === path) return;
    last.current = path;
    trackView(path);
  }, [path]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.("a.wa-float")) trackEvent("whatsapp_click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
