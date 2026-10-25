import type { NextConfig } from "next";

// The scaffold turns on Cache Components. A small shop site does not need it:
// pages revalidate with plain fetch caching instead (see lib/api.ts).
const nextConfig: NextConfig = {};

export default nextConfig;
