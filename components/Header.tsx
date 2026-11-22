"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/custom", label: "Custom orders" },
  { href: "/journal", label: "Journal" },
  { href: "/track", label: "Track order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { count } = useCart();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  // Escape closes the phone menu, and the menu never stays open on the next page
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="header">
      {(["left", "right"] as const).map((edge) => (
        <Image key={edge} src="/carvings/bracket.webp" alt="" width={1000} height={852} priority className={`corner-bracket ${edge}`} aria-hidden="true" />
      ))}
      <div className="wrap">
        <Link href="/" className="logo" aria-label="Vriksha Studio home">
          <Image src="/brand/logo.png" alt="Vriksha Studio" width={641} height={864} priority className="logo-img" />
        </Link>
        <nav id="main-nav" className={`nav${open ? " open" : ""}`} aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={path === l.href || path.startsWith(`${l.href}/`) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="row">
          <Link href="/cart" className="cart-link" onClick={() => setOpen(false)} aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 4h2.500l2.200 11h10.100l2-8H6.200M9.500 20a.5.5 0 1 0 0-.01M17 20a.5.5 0 1 0 0-.01" />
            </svg>
            <span>Cart</span>
            {count > 0 && <span className="cart-count">{count}</span>}
          </Link>
          <button
            type="button"
            className="btn outline menu-btn"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}
