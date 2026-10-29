import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Cookie policy" };

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie policy"
      intro="Short version: this website does not set cookies, and it does not track you. It keeps a little information in your own browser so your cart works. This page lists exactly what."
    >
      <h2>What is a cookie</h2>
      <p>
        A cookie is a small file a website asks your browser to keep, often to recognise you on later visits or to follow what you do across sites. Browsers also have other places a site can keep small pieces of information, such as &ldquo;local storage&rdquo;. We explain both here.
      </p>

      <h2>What this website keeps in your browser</h2>
      <div className="card" style={{ overflowX: "auto" }}>
        <table className="legal-table">
          <thead>
            <tr>
              <th>What</th>
              <th>Where</th>
              <th>Why</th>
              <th>How long</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Your cart (the pieces and quantities you added)</td>
              <td>Local storage on this device</td>
              <td>So your cart is still there when you come back or reload the page</td>
              <td>Until you empty the cart, place the order, or clear your browser data</td>
            </tr>
            <tr>
              <td>A summary of the order you just placed</td>
              <td>Session storage on this device</td>
              <td>To show your order number and payment steps on the thank-you page</td>
              <td>Until you close that browser tab</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Both are needed for the cart and checkout to work, are never sent to anyone as a profile of you, and are not used for advertising or analytics. Because they are strictly necessary, we do not show a cookie banner.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>We set no advertising, tracking or analytics cookies, and use no tracking pixels.</li>
        <li>We do not use social-media buttons that follow you around the web.</li>
        <li>Our fonts are served from this website itself, not from an outside font service.</li>
      </ul>

      <h2>Other websites</h2>
      <p>
        Some buttons open other services, such as WhatsApp or your UPI app. Those services have their own cookies and policies, which apply once you are on them.
      </p>

      <h2>Your choices</h2>
      <p>
        You can clear this information at any time in your browser settings (look for &ldquo;site data&rdquo; or &ldquo;clear browsing data&rdquo;). If you do, your cart will be emptied. You can also block cookies and storage completely, but then the cart and checkout will not work.
      </p>

      <h2>If this changes</h2>
      <p>
        If we ever add anything that is not strictly necessary, such as visitor statistics, we will first ask for your permission with a clear choice, and update this page. See also our <Link href="/privacy">privacy policy</Link>.
      </p>
    </LegalPage>
  );
}
