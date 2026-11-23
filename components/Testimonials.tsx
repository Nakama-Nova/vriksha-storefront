import { TESTIMONIALS } from "@/lib/testimonials";

/** Customers' own words (lib/testimonials.ts). Shows nothing until there is at least one real comment. */
export function Testimonials() {
  if (!TESTIMONIALS.length) return null;
  return (
    <section className="section" aria-labelledby="voices">
      <div className="wrap stack" style={{ gap: 28 }}>
        <h2 id="voices">What our customers say</h2>
        <div className="voices">
          {TESTIMONIALS.map((t) => (
            <figure key={`${t.name}-${t.text.slice(0, 20)}`} className="voice">
              <blockquote>
                <p>{t.text}</p>
              </blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                {(t.place || t.piece) && <span className="muted small"> · {[t.piece, t.place].filter(Boolean).join(", ")}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
