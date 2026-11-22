import type { DescBlock } from "@/lib/describe";

/** The rest of a product's description (the introduction is shown near the price) as headings, facts and paragraphs. */
export function ProductDescription({ blocks }: { blocks: DescBlock[] }) {
  if (!blocks.length) return null;
  return (
    <div className="desc stack" style={{ gap: 12 }}>
      {blocks.map((b, i) =>
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
