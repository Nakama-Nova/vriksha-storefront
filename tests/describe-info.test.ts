import { describe, expect, it } from "vitest";
import { describe as readDescription } from "@/lib/describe";
import { finishOptions, glance, mattressFit } from "@/lib/productInfo";
import { ribbonText } from "@/lib/ribbon";
import { product } from "./fixtures";

const KING = [
  "Royal Handcrafted Pure Teak Wood King Size Bed",
  "Elevate your bedroom with this majestic King Size bed, masterfully carved. Combining heritage art.",
  "",
  "Key Highlights:",
  "",
  "Material: 100% Genuine, termite-resistant Solid Teak Wood",
  "",
  "Finish: Available in Natural Matte or Rich Warm Honey Gloss Polish",
  "",
  'Dimensions (L × W × H): 2,235 mm × 1,980 mm × 1,524 mm (Fits standard 78" × 72" mattress)',
  "",
  "A luxurious blend of royal aesthetics.",
].join("\n");

describe("reading a staff-typed description", () => {
  it("skips the title line, finds the introduction, headings, facts and closing words", () => {
    const d = readDescription(KING, "Royal CNC-Carved Teak Wood King Size Bed");
    expect(d.intro).toMatch(/^Elevate your bedroom/);
    expect(d.blocks.map((b) => b.kind)).toEqual(["heading", "facts", "text"]);
    const facts = d.blocks.find((b) => b.kind === "facts");
    expect(facts && facts.kind === "facts" && facts.items.map((i) => i.label)).toEqual(["Material", "Finish", "Dimensions (L × W × H)"]);
  });
  it("copes with nothing, or with only the name repeated", () => {
    expect(readDescription(null)).toEqual({ intro: null, blocks: [] });
    expect(readDescription("Queen Bed", "Queen Bed").intro).toBeNull();
  });
});

describe("facts for the product page", () => {
  const blocks = readDescription(KING, "x").blocks;
  it("finds the finish choices", () => {
    expect(finishOptions(blocks)).toEqual(["Natural Matte", "Rich Warm Honey Gloss Polish"]);
    expect(finishOptions([])).toEqual([]);
  });
  it("finds the mattress fit", () => {
    expect(mattressFit(blocks)).toBe('Standard 78" × 72" mattress');
  });
  it("builds the at-a-glance list from only what is known", () => {
    const g = glance(product({ dimensions_mm: { l: 2235, w: 1980, h: 1524 }, lead_time_days: null }), blocks);
    expect(g.map((x) => x.label)).toEqual(["Wood", "Size", "Finish", "Mattress", "Made"]);
    expect(g.find((x) => x.label === "Size")?.value).toBe("7 ft 4 in × 6 ft 6 in × 5 ft (L × W × H)");
    const bare = glance(product({ wood_type: null, made_to_order: false }), []);
    expect(bare).toEqual([{ label: "Made", value: "Ready to ship" }]);
  });
});

describe("ribbons", () => {
  it("shows the words for known ribbons and ignores unknown ones", () => {
    expect(ribbonText("new")).toBe("New");
    expect(ribbonText("few_left")).toBe("Only a few left");
    expect(ribbonText("sparkly")).toBeNull();
    expect(ribbonText(null)).toBeNull();
  });
});
