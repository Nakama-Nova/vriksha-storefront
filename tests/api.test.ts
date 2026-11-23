import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, getAnnouncement, getBanner, getCatalog, getComments, trackOrder } from "@/lib/api";

afterEach(() => vi.unstubAllGlobals());

const reply = (status: number, body: unknown) =>
  vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body } as Response);

describe("talking to the shop's server", () => {
  it("turns the server's messages into plain words", async () => {
    vi.stubGlobal("fetch", reply(404, { detail: "Order not found" }));
    await expect(trackOrder("ORD-1", "9000000000")).rejects.toMatchObject({ message: "Order not found", status: 404 });

    vi.stubGlobal("fetch", reply(422, { detail: [{ msg: "Enter a valid 10-digit mobile number", loc: ["query", "phone"] }] }));
    await expect(trackOrder("ORD-1", "1")).rejects.toMatchObject({ message: "phone: Enter a valid 10-digit mobile number" });

    vi.stubGlobal("fetch", reply(429, null));
    await expect(trackOrder("ORD-1", "9000000000")).rejects.toThrow(/Too many requests/);

    vi.stubGlobal("fetch", reply(500, null));
    await expect(trackOrder("ORD-1", "9000000000")).rejects.toThrow(/Something went wrong/);
  });
  it("says so when the server cannot be reached at all", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")));
    const err = await trackOrder("ORD-1", "9000000000").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(0);
    expect(err.message).toMatch(/Cannot reach the shop server/);
  });
  it("never sends the phone number in this site's own address, only to the API", async () => {
    const f = reply(200, { order_number: "ORD-1" });
    vi.stubGlobal("fetch", f);
    await trackOrder(" ord-1 ", "98765 43210");
    const url = String(f.mock.calls[0][0]);
    expect(url).toContain("/public/orders/ord-1?phone=98765%2043210");
  });
  it("the page-building helpers fall back to nothing instead of crashing when the server is down", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("down")));
    expect(await getCatalog()).toBeNull();
    expect(await getComments()).toEqual([]);
    expect(await getAnnouncement()).toBeNull();
    expect(await getBanner()).toBeNull();
  });
  it("reads the whole catalogue across pages of 50", async () => {
    const page = (n: number) => Array.from({ length: n }, (_, i) => ({ slug: `p${i}` }));
    const f = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => page(50) } as Response)
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => page(7) } as Response);
    vi.stubGlobal("fetch", f);
    expect(await getCatalog()).toHaveLength(57);
    expect(f).toHaveBeenCalledTimes(2);
  });
});
