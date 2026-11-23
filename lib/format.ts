const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** "18500.00" or 18500 -> "₹18,500" */
export function rupees(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value;
  return `₹${inr.format(Number.isFinite(n) ? n : 0)}`;
}

const MM_PER_INCH = 25.4;

/** 2235 -> "7 ft 4 in", 1524 -> "5 ft", 150 -> "6 in". Rounded to the nearest inch, as furniture is measured. */
export function feetInches(mm: number): string {
  const total = Math.round(mm / MM_PER_INCH);
  const feet = Math.floor(total / 12);
  const inches = total % 12;
  if (feet === 0) return `${inches} in`;
  return inches === 0 ? `${feet} ft` : `${feet} ft ${inches} in`;
}

/** 2235 -> "223.5 cm", 1980 -> "198 cm" */
export function centimetres(mm: number): string {
  return `${Number((mm / 10).toFixed(1))} cm`;
}

export type Dimensions = { l?: number; w?: number; h?: number } | null;

/** The three sizes the shop records, each in feet and inches, centimetres and millimetres. Empty when none is set. */
export function sizeRows(d: Dimensions): { label: string; value: string }[] {
  if (!d) return [];
  const rows: [string, number | undefined][] = [
    ["Length", d.l],
    ["Width", d.w],
    ["Height", d.h],
  ];
  return rows
    .filter((r): r is [string, number] => typeof r[1] === "number" && r[1] > 0)
    .map(([label, mm]) => ({ label, value: `${feetInches(mm)} · ${centimetres(mm)} · ${mm} mm` }));
}

/** One line for the top of the product page: "7 ft 4 in × 6 ft 6 in × 5 ft (L × W × H)". Feet and inches first, as most shoppers think in them. */
export function sizeSummary(d: Dimensions): string | null {
  if (!d) return null;
  const parts = [d.l, d.w, d.h].filter((v): v is number => typeof v === "number" && v > 0);
  if (!parts.length) return null;
  const tags = [d.l ? "L" : null, d.w ? "W" : null, d.h ? "H" : null].filter(Boolean).join(" × ");
  return `${parts.map(feetInches).join(" × ")}${parts.length > 1 ? ` (${tags})` : ""}`;
}

export function dateText(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
