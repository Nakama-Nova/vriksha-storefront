// The small labels staff can put on a product's photo (set in the backend's /site/admin page).
export const RIBBONS: Record<string, string> = {
  new: "New",
  bestseller: "Bestseller",
  few_left: "Only a few left",
  offer: "Offer",
};

/** The words for a ribbon, or null for none or one we do not know (so a new kind never breaks a page). */
export const ribbonText = (ribbon: string | null | undefined) => (ribbon && RIBBONS[ribbon]) || null;
