import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

const heading = Cormorant_Garamond({ variable: "--font-heading", subsets: ["latin"], weight: ["600", "700"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Vriksha Studio · Wood furniture and carvings", template: "%s · Vriksha Studio" },
  description: "Handcrafted wood furniture and carved art, made in our own workshops. Custom pieces on request.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="announce">Handcrafted wood furniture &amp; carvings · Custom orders welcome</div>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
