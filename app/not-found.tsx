import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap stack" style={{ alignItems: "flex-start" }}>
        <h1>We could not find that page</h1>
        <p className="muted">The piece may have been sold or taken down.</p>
        <Link href="/shop" className="btn primary">
          Browse the shop
        </Link>
      </div>
    </section>
  );
}
