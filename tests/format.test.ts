import { describe, expect, it } from "vitest";
import { centimetres, feetInches, rupees, sizeRows, sizeSummary } from "@/lib/format";

describe("rupees", () => {
  it("uses Indian digit grouping and no decimals", () => {
    expect(rupees("110330.00")).toBe("₹1,10,330");
    expect(rupees(18500)).toBe("₹18,500");
    expect(rupees(0)).toBe("₹0");
  });
  it("shows ₹0 for something that is not a number rather than NaN", () => {
    expect(rupees("abc")).toBe("₹0");
  });
});

describe("sizes in feet and inches, centimetres and millimetres", () => {
  it("rounds to the nearest inch", () => {
    expect(feetInches(2235)).toBe("7 ft 4 in");
    expect(feetInches(1980)).toBe("6 ft 6 in");
    expect(feetInches(1524)).toBe("5 ft");
    expect(feetInches(150)).toBe("6 in");
    expect(feetInches(305)).toBe("1 ft");
  });
  it("shows centimetres without a pointless .0", () => {
    expect(centimetres(2235)).toBe("223.5 cm");
    expect(centimetres(1980)).toBe("198 cm");
  });
  it("lists length, width and height with all three units", () => {
    expect(sizeRows({ l: 2235, w: 1980, h: 1524 })).toEqual([
      { label: "Length", value: "7 ft 4 in · 223.5 cm · 2235 mm" },
      { label: "Width", value: "6 ft 6 in · 198 cm · 1980 mm" },
      { label: "Height", value: "5 ft · 152.4 cm · 1524 mm" },
    ]);
  });
  it("leaves out sizes that are missing or zero, and handles no size at all", () => {
    expect(sizeRows({ w: 600, h: 0 }).map((r) => r.label)).toEqual(["Width"]);
    expect(sizeRows(null)).toEqual([]);
    expect(sizeSummary(null)).toBeNull();
    expect(sizeSummary({})).toBeNull();
  });
  it("gives one summary line, feet and inches first", () => {
    expect(sizeSummary({ l: 2235, w: 1980, h: 1524 })).toBe("7 ft 4 in × 6 ft 6 in × 5 ft (L × W × H)");
    expect(sizeSummary({ w: 600 })).toBe("2 ft");
  });
});
