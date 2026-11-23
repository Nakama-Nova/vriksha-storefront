import type { DescBlock } from "@/lib/describe";

/** The rest of a product's description (the introduction is shown near the price) as headings, facts and paragraphs. */
/** `hide`: fact labels to leave out because the page already shows them elsewhere (such as the size, shown in feet, inches, cm and mm). */
export function ProductDescription({ blocks, hide }: { blocks: DescBlock[]; hide?: RegExp }) {
  const shown = blocks
    .map((b) => (b.kind === "facts" && hide ? { ...b, items: b.items.filter((it) => !hide.test(it.label)) } : b))
    .filter((b) => b.kind !== "facts" || b.items.length > 0);
  if (!shown.length) return null;
  return (
    <div className="desc stack" style={{ gap: 12 }}>
      {shown.map((b, i) =>
        b.kind === "heading" ? (
          <h3 key={i} className="desc-h">
            {b.text}
          </h3>
        ) : b.kind === "facts" ? (
          <dl key={i} className="specs" style={{ margin: 0 }}>
            {b.items.map((it) => (
              <div key={it.label}>
                <dt>{it.label}</dt>
                <dd>{it.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p key={i}>{b.text}</p>
        ),
      )}
    </div>
  );
}
