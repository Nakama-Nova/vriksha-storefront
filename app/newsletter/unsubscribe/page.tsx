import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterAction } from "@/components/NewsletterAction";

// The link carries a private token: keep the page out of search and do not pass it on as a referrer.
export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function UnsubscribePage(props: PageProps<"/newsletter/unsubscribe">) {
  const { token } = await props.searchParams;
  const value = typeof token === "string" ? token : "";

  return (
    <section className="section">
      <div className="wrap stack" style={{ maxWidth: 560 }}>
        {value ? (
          <NewsletterAction kind="unsubscribe" token={value} />
        ) : (
          <div className="card stack">
            <h1>This link is not complete</h1>
            <p className="muted">
              Please use the unsubscribe link at the bottom of any email we sent you. If you need help, write to us from the <Link href="/contact">contact page</Link>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
