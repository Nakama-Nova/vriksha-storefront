// Facts pulled from a product's description and record, for the "at a glance" strip and the customise box.
// The description is typed by staff (see lib/describe.ts), so everything here is read defensively.

import type { Product } from "./api";
import type { DescBlock } from "./describe";
import { sizeSummary } from "./format";

const facts = (blocks: DescBlock[]) => blocks.flatMap((b) => (b.kind === "facts" ? b.items : []));
const fact = (blocks: DescBlock[], label: RegExp) => facts(blocks).find((f) => label.test(f.label))?.value ?? null;

/** "Available in Natural Matte or Rich Warm Honey Gloss Polish" -> ["Natural Matte", "Rich Warm Honey Gloss Polish"]. Empty when there is no choice to offer. */
export function finishOptions(blocks: DescBlock[]): string[] {
  const v = fact(blocks, /^finish/i);
  if (!v) return [];
  const parts = v
    .replace(/^available in\s+/i, "")
    .split(/\s+or\s+|,\s*/i)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);
  return parts.length > 1 ? parts : [];
}

/** 'Fits standard 78" x 72" mattress' from "(Fits standard 78" x 72" mattress)" in the dimensions line, if staff wrote one. */
export function mattressFit(blocks: DescBlock[]): string | null {
  for (const f of facts(blocks)) {
    const m = /\((fits[^)]*)\)/i.exec(f.value);
    if (m) {
      const v = m[1].replace(/^fits\s+/i, "");
      return v.charAt(0).toUpperCase() + v.slice(1);
    }
  }
  return null;
}

export type Glance = { label: string; value: string };

/** The handful of facts a buyer wants at once. Only what is really known is listed. */
export function glance(p: Product, blocks: DescBlock[]): Glance[] {
  const out: Glance[] = [];
  if (p.wood_type) out.push({ label: "Wood", value: `Solid ${p.wood_type.toLowerCase()}` });
  const size = sizeSummary(p.dimensions_mm);
  if (size) out.push({ label: "Size", value: size });
  const finishes = finishOptions(blocks);
  if (finishes.length) out.push({ label: "Finish", value: finishes.join(" or ") });
  const fit = mattressFit(blocks);
  if (fit) out.push({ label: "Mattress", value: fit });
  out.push({
    label: "Made",
    value: p.made_to_order ? `To order in our workshop${p.lead_time_days ? `, about ${p.lead_time_days} days` : ""}` : "Ready to ship",
  });
  return out;
}

// General care for solid wood. TODO owner: confirm or edit these before relying on them.
export const CARE: Record<"furniture" | "sculpture", string[]> = {
  furniture: [
    "Dust with a dry, soft cloth. Avoid wet wiping.",
    "Keep it away from direct sun, heaters and damp walls: wood moves with heat and moisture.",
    "Wipe spills at once, and use mats or coasters under hot or wet things.",
    "Use a little furniture wax or polish only when the finish looks dry. Avoid strong chemical cleaners.",
  ],
  sculpture: [
    "Dust with a soft, dry brush, especially in the carved grooves.",
    "Keep it dry and out of direct sun.",
    "Avoid sprays and chemical cleaners; a very little wax now and then keeps the wood fed.",
  ],
};
