import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageBanner } from "@/components/PageBanner";
import { SideArt } from "@/components/SideArt";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PHONE, SITE_URL } from "@/lib/config";
import "./globals.css";

const heading = Cormorant_Garamond({ variable: "--font-heading", subsets: ["latin"], weight: ["600", "700"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Vriksha Studio · Wood furniture and carvings", template: "%s · Vriksha Studio" },
  description: "Handcrafted solid-wood furniture and carved temple art, made to order in our own workshop. Custom pieces on request. Nothing to pay online.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Vriksha Studio",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/brand/logo.png", width: 641, height: 864, alt: "Vriksha Studio" }],
  },
  twitter: { card: "summary" },
};

// Tells Google who we are: shown in search results beside the site name
const orgLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: "Vriksha Studio",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo.png`,
  description: "Handcrafted solid-wood furniture and carved temple art, made to order in our own workshop.",
  areaServed: "IN",
  ...(PHONE ? { telephone: PHONE } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd).replace(/</g, "\\u003c") }} />
        <div className="announce">
          Made to order in our own workshop · Nothing to pay online until we call you
          {PHONE && (
            <>
              {" "}
              · <a href={`tel:${PHONE.replace(/\s/g, "")}`}>Call {PHONE}</a>
            </>
          )}
        </div>
        <Header />
        <PageBanner />
        <SideArt />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
