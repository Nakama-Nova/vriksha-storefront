import Link from "next/link";
import { PHONE, WHATSAPP } from "@/lib/config";
import { POLICY_LINKS } from "@/lib/legal";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="stack" style={{ maxWidth: 320 }}>
          <span className="brand-name">Vriksha Studio</span>
          <p className="small">Wood furniture and carved art, made in our own workshops.</p>
          {(PHONE || WHATSAPP) && <p className="small">{PHONE || `WhatsApp +${WHATSAPP}`}</p>}
        </div>
        <div className="row" style={{ gap: 56, alignItems: "flex-start" }}>
          <div>
            <h4>Shop</h4>
            <ul>
              <li>
                <Link href="/shop">All pieces</Link>
              </li>
              <li>
                <Link href="/shop?category=Furniture">Furniture</Link>
              </li>
              <li>
                <Link href="/custom">Custom orders</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li>
                <Link href="/track">Track your order</Link>
              </li>
              <li>
                <Link href="/cart">Cart</Link>
              </li>
              <li>
                <Link href="/about">About us</Link>
              </li>
              <li>
                <Link href="/faq">Questions and answers</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Policies</h4>
            <ul>
              {POLICY_LINKS.filter((l) => l.href !== "/faq").map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <small>© Vriksha Studios. All prices in INR.</small>
    </footer>
  );
}
