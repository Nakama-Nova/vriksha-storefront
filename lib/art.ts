/** Wood-carving cut-outs in public/carvings (backgrounds removed), with their pixel sizes. */
export const CARVINGS = {
  balaji: [440, 1000],
  dolls: [782, 1000],
  door: [656, 1000],
  bracket: [1000, 852],
  furniture: [733, 998],
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

/** Width of a carving relative to its height. */
export const aspect = (name: Carving) => CARVINGS[name][0] / CARVINGS[name][1];

/** A carving on the page; `flip` mirrors it. Carvings are photographed facing right, so a flipped copy faces left. */
export type Piece = { name: Carving; flip?: true };

/** `edge` carvings at both ends facing each other, `god` between them. */
const facing = (edge: Carving, god: Carving): Piece[] => [{ name: edge }, { name: god }, { name: edge, flip: true }];
/** Margin carvings: the same carving each side, facing the page. */
const flank = (name: Carving): [Piece, Piece] => [{ name }, { name, flip: true }];

type Art = { shelf: readonly Piece[]; corners?: Carving; side: [Piece, Piece] };

const ROUTES: [string, Art][] = [
  // Corner brackets with the Marapachi set between them
  ["/shop", { shelf: [{ name: "dolls" }], corners: "bracket", side: flank("yali-dark") }],
  ["/custom", { shelf: facing("horse-painted", "ganesha-painted"), side: flank("yali-painted") }],
  ["/about", { shelf: facing("yali-dark", "balaji"), side: flank("horse-dark") }],
  ["/contact", { shelf: facing("horse-dark", "ganesha-painted"), side: flank("yali-dark") }],
  ["/catalogue", { shelf: facing("horse-dark", "balaji"), side: flank("yali-dark") }],
  ["/track", { shelf: facing("yali-dark", "ganesha-dark"), side: flank("horse-dark") }],
  ["/cart", { shelf: facing("yali-dark", "ganesha-dark"), side: flank("horse-dark") }],
  ["/checkout", { shelf: facing("yali-dark", "ganesha-dark"), side: flank("horse-dark") }],
  ["/thanks", { shelf: facing("yali-dark", "ganesha-dark"), side: flank("horse-dark") }],
];

/** Policy pages and anything not listed. */
const DEFAULT_ART: Art = { shelf: facing("horse-dark", "ganesha-dark"), side: flank("yali-dark") };

export function artFor(path: string): Art {
  // The home page has its own hero instead of a shelf.
  if (path === "/") return { shelf: [], side: [{ name: "yali-dark" }, { name: "yali-painted", flip: true }] };
  const hit = ROUTES.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`));
  return hit ? hit[1] : DEFAULT_ART;
}
