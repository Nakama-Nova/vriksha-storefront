import { afterEach, describe, expect, it, vi } from "vitest";
import { isOvernight, OVERNIGHT_NOTICE } from "@/lib/hours";

// India time is UTC+5:30, so 00:00 in India is 18:30 UTC the day before.
const india = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const utcMinutes = (h * 60 + m - 330 + 1440) % 1440;
  return new Date(Date.UTC(2026, 10, 23, Math.floor(utcMinutes / 60), utcMinutes % 60));
};

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("the overnight window (India time)", () => {
  it("is closed from midnight until about a quarter past five", () => {
    for (const t of ["00:00", "00:01", "02:30", "04:55", "05:14"]) expect(isOvernight(india(t))).toBe(true);
  });
  it("is open the rest of the day", () => {
    for (const t of ["05:15", "05:16", "09:00", "14:00", "23:59"]) expect(isOvernight(india(t))).toBe(false);
  });
});

describe("what people are told when the server cannot be reached", () => {
  async function trackWhileDown(at: string) {
    vi.useFakeTimers();
    vi.setSystemTime(india(at));
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")));
    const { trackOrder } = await import("@/lib/api");
    return trackOrder("ORD-1", "9000000000").then(
      () => new Error("expected the call to fail"),
      (e: Error) => e,
    );
  }
  it("says the shop rests overnight and when it reopens, at night", async () => {
    const err = await trackWhileDown("02:00");
    expect(err.message).toBe(OVERNIGHT_NOTICE);
    expect(err.message).toMatch(/5 am/);
  });
  it("keeps the ordinary message during the day", async () => {
    const err = await trackWhileDown("15:00");
    expect(err.message).toMatch(/Cannot reach the shop server/);
  });
});
