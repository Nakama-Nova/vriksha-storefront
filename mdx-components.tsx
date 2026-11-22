import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Components used by every journal post. Plain markdown maps to these.
const components = {
  // Site links go through the router; outside links open safely in a new tab.
  a: ({ href = "", children }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
