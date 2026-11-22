// The shop's staff type a product description as plain text with line breaks, for example
//
//   Royal Handcrafted Teak Bed            <- a title line
//   Elevate your bedroom with ...         <- the real introduction
//   Key Highlights:                       <- a small heading
//   Material: 100% Solid Teak             <- facts
//
// Shown as one paragraph (HTML collapses line breaks) that is a wall of text. This turns it into an
// introduction, headings, facts and paragraphs the product page can lay out. Pure, so it is easy to read.

export type DescBlock =
  | { kind: "heading"; text: string }
  | { kind: "facts"; items: { label: string; value: string }[] }
  | { kind: "text"; text: string };

export type Described = { intro: string | null; blocks: DescBlock[] };

const FACT = /^([A-Z][A-Za-z0-9 ()/×&.,'-]{1,40}?):\s+(\S.*)$/;
const HEADING = /^([A-Z][^:]{1,60}):$/;
const ENDS_SENTENCE = /[.!?)"”]$/;

export function describe(raw: string | null | undefined, name = ""): Described {
  const lines = (raw ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // A first line that only repeats the product's name, or is a short title with no full stop, is not an introduction
  const isTitle = (l: string) => l.length < 90 && !ENDS_SENTENCE.test(l) && !HEADING.test(l) && !FACT.test(l);
  while (lines.length > 1 && (isTitle(lines[0]) || lines[0].toLowerCase() === name.toLowerCase())) lines.shift();

  let intro: string | null = null;
  const blocks: DescBlock[] = [];
  for (const line of lines) {
    const heading = HEADING.exec(line);
    const fact = FACT.exec(line);
    if (heading) {
      blocks.push({ kind: "heading", text: heading[1] });
    } else if (fact && fact[2].length < 160) {
      const last = blocks[blocks.length - 1];
      const item = { label: fact[1], value: fact[2] };
      if (last?.kind === "facts") last.items.push(item);
      else blocks.push({ kind: "facts", items: [item] });
    } else if (intro === null && blocks.length === 0) {
      intro = line;
    } else {
      blocks.push({ kind: "text", text: line });
    }
  }
  if (intro && intro.toLowerCase() === name.trim().toLowerCase()) intro = null; // just the name again
  return { intro, blocks };
}
