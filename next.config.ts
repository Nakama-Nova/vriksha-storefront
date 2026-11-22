import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// The scaffold turns on Cache Components. A small shop site does not need it:
// pages revalidate with plain fetch caching instead (see lib/api.ts).
const nextConfig: NextConfig = {};

// Journal posts are .mdx files in content/journal (see lib/journal.ts).
const withMDX = createMDX({});

export default withMDX(nextConfig);
