import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterAction } from "@/components/NewsletterAction";

// The link carries a private token: keep the page out of search and do not pass it on as a referrer.
export const metadata: Metadata = { title: "Confirm your subscription", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function ConfirmPage(props: PageProps<"/newsletter/confirm">) {
  const { token } = await props.searchParams;
  const value = typeof token === "string" ? token : "";

  return (
    <section className="section">
      <div className="wrap stack" style={{ maxWidth: 560 }}>
        {value ? (
          <NewsletterAction kind="confirm" token={value} />
        ) : (
          <div className="card stack">
            <h1>This link is not complete</h1>
            <p className="muted">Please use the link in the email we sent you, or sign up again from the bottom of any page.</p>
            <Link href="/" className="btn primary" style={{ alignSelf: "flex-start" }}>
              Go home
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
