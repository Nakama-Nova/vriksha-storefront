import Link from "next/link";
import { getComments } from "@/lib/api";

/** What customers said: comments that staff approved (customers send them from /comment). Shows nothing while there are none. */
export async function Testimonials() {
  const comments = await getComments();
  if (!comments.length) return null;
  return (
    <section className="section" aria-labelledby="voices">
      <div className="wrap stack" style={{ gap: 28 }}>
        <h2 id="voices">What our customers say</h2>
        <div className="voices">
          {comments.map((t) => (
            <figure key={`${t.name}-${t.text.slice(0, 24)}`} className="voice">
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
        <p className="small muted">
          Ordered from us? <Link href="/comment">Share your experience</Link>.
        </p>
      </div>
    </section>
  );
}
