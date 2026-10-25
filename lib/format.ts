const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** "18500.00" or 18500 -> "₹18,500" */
export function rupees(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value;
  return `₹${inr.format(Number.isFinite(n) ? n : 0)}`;
}

export function sizeText(d: { l?: number; w?: number; h?: number } | null): string | null {
  if (!d) return null;
  const parts = [d.l, d.w, d.h].filter((v): v is number => typeof v === "number");
  return parts.length ? `${parts.join(" × ")} mm` : null;
}

export function dateText(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
