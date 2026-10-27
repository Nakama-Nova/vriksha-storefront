"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/custom", label: "Custom orders" },
  { href: "/track", label: "Track order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { count } = useCart();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="wrap">
        <Link href="/" className="logo" aria-label="Vriksha Studio home">
          {/* Replace with the logo image once a transparent PNG/SVG exists */}
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-name">Vriksha</span>
          <span className="logo-sub">STUDIO</span>
        </Link>
        <nav className={`nav${open ? " open" : ""}`} aria-label="Main">
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
          <Link href="/cart" className="cart-link" onClick={() => setOpen(false)}>
            Cart ({count})
          </Link>
          <button
            type="button"
            className="btn outline menu-btn"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
