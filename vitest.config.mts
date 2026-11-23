import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Fast tests for the logic that handles money, sizes, filters and the cart. See tests/.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { include: ["tests/**/*.test.ts"], environment: "node" },
});
