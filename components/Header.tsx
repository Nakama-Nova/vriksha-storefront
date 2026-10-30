"use client";

import Image from "next/image";
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
      {(["left", "right"] as const).map((edge) => (
        <Image key={edge} src="/carvings/bracket.webp" alt="" width={1000} height={852} priority className={`corner-bracket ${edge}`} aria-hidden="true" />
      ))}
      <div className="wrap">
        <Link href="/" className="logo" aria-label="Vriksha Studio home">
          <Image src="/brand/logo.png" alt="Vriksha Studio" width={641} height={864} priority className="logo-img" />
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
