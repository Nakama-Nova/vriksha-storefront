/** Wood-carving cut-outs in public/carvings (backgrounds removed), with their pixel sizes. */
export const CARVINGS = {
  balaji: [440, 1000],
  dolls: [782, 1000],
  door: [656, 1000],
  "ganesha-dark": [489, 1000],
  "ganesha-painted": [489, 1000],
  "horse-dark": [466, 1000],
  "horse-painted": [467, 1000],
  "pillar-a": [195, 1000],
  "pillar-b": [190, 1000],
  sandalwood: [537, 1000],
  "wall-dark": [1000, 506],
  "wall-painted": [1000, 519],
  "wall-raw": [1000, 514],
  "yali-dark": [310, 1000],
  "yali-painted": [308, 1000],
} as const;
export type Carving = keyof typeof CARVINGS;

const SIDES = {
  yali: ["yali-dark", "yali-painted"],
  pillar: ["pillar-a", "pillar-b"],
  horse: ["horse-dark", "horse-painted"],
  ganesha: ["ganesha-dark", "ganesha-painted"],
} as const satisfies Record<string, readonly [Carving, Carving]>;

/** Width of a carving relative to its height. */
export const aspect = (name: Carving) => CARVINGS[name][0] / CARVINGS[name][1];

type Art = { shelf: readonly Carving[]; side: keyof typeof SIDES };

const ROUTES: [string, Art][] = [
  ["/shop", { shelf: ["wall-raw", "wall-dark", "wall-painted"], side: "horse" }],
  ["/custom", { shelf: ["horse-dark", "door", "horse-painted"], side: "pillar" }],
  ["/about", { shelf: ["dolls", "balaji", "ganesha-dark"], side: "pillar" }],
  ["/contact", { shelf: ["sandalwood", "ganesha-painted", "yali-painted"], side: "horse" }],
  ["/catalogue", { shelf: ["pillar-a", "balaji", "pillar-b"], side: "yali" }],
  ["/track", { shelf: ["yali-dark", "sandalwood", "yali-painted"], side: "ganesha" }],
  ["/cart", { shelf: ["yali-dark", "sandalwood", "yali-painted"], side: "ganesha" }],
  ["/checkout", { shelf: ["yali-dark", "sandalwood", "yali-painted"], side: "ganesha" }],
  ["/thanks", { shelf: ["yali-dark", "sandalwood", "yali-painted"], side: "ganesha" }],
];

/** Policy pages and anything not listed. */
const DEFAULT_ART: Art = { shelf: ["ganesha-dark", "dolls", "ganesha-painted"], side: "pillar" };

export function artFor(path: string): { shelf: readonly Carving[]; side: readonly [Carving, Carving] } {
  // The home page has its own hero instead of a shelf.
  if (path === "/") return { shelf: [], side: SIDES.yali };
  const hit = ROUTES.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`));
  const art = hit ? hit[1] : DEFAULT_ART;
  return { shelf: art.shelf, side: SIDES[art.side] };
}
