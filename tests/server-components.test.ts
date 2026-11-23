import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("components that must stay plain server components", () => {
  it("the WhatsApp button is not a client component (that stopped pages from becoming interactive once a number was set)", () => {
    const source = readFileSync("components/WhatsAppButton.tsx", "utf8");
    expect(source).not.toMatch(/["']use client["']/);
  });
});
