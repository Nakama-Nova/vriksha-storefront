import { afterEach, describe, expect, it, vi } from "vitest";
import { hit, mayCount, trackEvent, trackView } from "@/lib/track";

afterEach(() => {
  vi.unstubAllGlobals();
});

function visitor(extra: Record<string, unknown> = {}) {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true });
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("navigator", { doNotTrack: null, ...extra });
  vi.stubGlobal("window", {});
  return fetchMock;
}

describe("visitor counting", () => {
  it("sends only the kind and the page or action name", () => {
    const f = visitor();
    trackView("/shop/teak-bed");
    trackEvent("add_to_cart");
    expect(f).toHaveBeenCalledTimes(2);
    const [url, init] = f.mock.calls[0];
    expect(String(url)).toMatch(/\/public\/hit$/);
    expect(JSON.parse(init.body)).toEqual({ kind: "view", key: "/shop/teak-bed" });
    expect(JSON.parse(f.mock.calls[1][1].body)).toEqual({ kind: "event", key: "add_to_cart" });
    // nothing that identifies a person is attached: no cookies, no credentials
    expect(init.credentials).toBeUndefined();
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
  });
  it("counts nothing when the browser says do not track", () => {
    const f = visitor({ doNotTrack: "1" });
    expect(mayCount()).toBe(false);
    hit("view", "/");
    expect(f).not.toHaveBeenCalled();
  });
  it("counts nothing when Global Privacy Control is on", () => {
    const f = visitor({ globalPrivacyControl: true });
    expect(mayCount()).toBe(false);
    trackEvent("order_placed");
    expect(f).not.toHaveBeenCalled();
  });
  it("never lets a counting failure reach the shop", () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.stubGlobal("navigator", { doNotTrack: null });
    vi.stubGlobal("window", {});
    expect(() => trackView("/")).not.toThrow();
  });
});
