import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { product } from "./fixtures";

// The module keeps the last good copy in memory, so each test starts from a fresh copy of it.
let api: typeof import("@/lib/api");
beforeEach(async () => {
  vi.resetModules();
  api = await import("@/lib/api");
});
afterEach(() => vi.unstubAllGlobals());

const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body }) as Response;
const fail = (status: number) => ({ ok: false, status, json: async () => ({ detail: "x" }) }) as Response;
const down = () => vi.fn().mockRejectedValue(new TypeError("network"));

describe("when the shop's server cannot be reached", () => {
  it("shows the last good catalogue instead of nothing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok([product({ slug: "a" }), product({ slug: "b" })])));
    expect(await api.getCatalog()).toHaveLength(2);
    vi.stubGlobal("fetch", down());
    expect(await api.getCatalog()).toHaveLength(2);
  });
  it("still says nothing when it has never loaded one", async () => {
    vi.stubGlobal("fetch", down());
    expect(await api.getCatalog()).toBeNull();
  });
  it("takes the new catalogue as soon as the server is back", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok([product({ slug: "a" })])));
    await api.getCatalog();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok([product({ slug: "a" }), product({ slug: "b" }), product({ slug: "c" })])));
    expect(await api.getCatalog()).toHaveLength(3);
  });
  it("shows the last good copy of a product", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok(product({ slug: "bed", name: "Bed" }))));
    expect((await api.getProduct("bed"))?.name).toBe("Bed");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(fail(503)));
    expect((await api.getProduct("bed"))?.name).toBe("Bed");
  });
  it("never turns an outage into a 'not found': with no copy it throws instead", async () => {
    vi.stubGlobal("fetch", down());
    await expect(api.getProduct("bed")).rejects.toThrow(/Cannot reach/);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(fail(500)));
    await expect(api.getProduct("bed")).rejects.toBeDefined();
  });
  it("still says not found when the server says the product does not exist, and forgets the old copy", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok(product({ slug: "bed" }))));
    await api.getProduct("bed");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(fail(404)));
    expect(await api.getProduct("bed")).toBeNull();
    vi.stubGlobal("fetch", down());
    await expect(api.getProduct("bed")).rejects.toBeDefined();
  });
});
