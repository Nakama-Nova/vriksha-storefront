import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// The scaffold turns on Cache Components. A small shop site does not need it:
// pages revalidate with plain fetch caching instead (see lib/api.ts).

// ---- Security headers (sent on every page) -------------------------------------------------
//
// The Content-Security-Policy tells the browser where this site may load scripts, images and data
// from. It has no nonces on purpose: a nonce forces every page to be rendered on each request, which
// would throw away the caching the shop relies on (see node_modules/next/dist/docs/01-app/02-guides/
// content-security-policy.md, "Without Nonces"). So inline scripts are allowed ('unsafe-inline': Next.js
// itself needs them), and the policy still blocks framing, plugins, a changed <base>, forms posting
// elsewhere, and any script, image or request to a place not listed here.
//
// What the site really loads from outside itself:
//  - the shop's backend (NEXT_PUBLIC_API_URL): product photos and 3D models, and every API call
//  - unpkg.com: the <model-viewer> script, only when someone opens a 3D view (components/ProductGallery.tsx)
//  - gstatic.com: decoders <model-viewer> fetches for compressed 3D models
// Fonts are served from this site (next/font). If you add a new outside service, add it here too.
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const apiOrigin = (() => {
  try {
    return new URL(API_URL).origin;
  } catch {
    return "";
  }
})();

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://unpkg.com",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${apiOrigin}`,
  "font-src 'self' data:",
  `connect-src 'self' data: blob: ${apiOrigin} https://www.gstatic.com`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
]
  .join("; ")
  .replace(/\s{2,}/g, " ");

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  // `next dev` needs eval and websockets for hot reload, so the policy is only sent in production builds.
  ...(isDev ? [] : [{ key: "Content-Security-Policy", value: csp }]),
  // Only ever use https for two years. (Vercel already sends the same value; kept here so a move to
  // another host keeps it. No includeSubDomains or preload: api.* and other subdomains are managed apart.)
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  // Never show this site inside another site's frame (clickjacking). Older browsers use this; CSP frame-ancestors covers the rest.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The camera and spatial tracking are only for "view in your room" on a 3D piece; nothing else is allowed.
  { key: "Permissions-Policy", value: "camera=(self), xr-spatial-tracking=(self), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // do not announce the framework
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

// Journal posts are .mdx files in content/journal (see lib/journal.ts).
const withMDX = createMDX({});

export default withMDX(nextConfig);
