"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * "Customise this piece": pick a finish (when the description lists some) and send a request for a custom version.
 * Nothing is bought here: the choices go to the custom-order form, pre-filled, and the shop quotes before any payment.
 */
export function Customise({ piece, finishes, size, wood }: { piece: string; finishes: string[]; size: string | null; wood: string | null }) {
  const [finish, setFinish] = useState(finishes[0] ?? "");
  const q = new URLSearchParams({ piece });
  if (finish) q.set("finish", finish);
  if (size) q.set("size", size);
  if (wood) q.set("wood", wood);

  return (
    <section className="card stack" aria-labelledby="customise" style={{ gap: 14 }}>
      <h2 id="customise" style={{ fontSize: "1.6rem" }}>
        Customise this piece
      </h2>
      {finishes.length > 0 && (
        <div role="radiogroup" aria-label="Finish" className="finish-options">
          {finishes.map((f) => (
            <label key={f} className={`option${finish === f ? " on" : ""}`}>
              <input type="radio" name="finish" checked={finish === f} onChange={() => setFinish(f)} />
              <span>
                <strong>{f}</strong>
              </span>
            </label>
          ))}
        </div>
      )}
      <p className="muted">
        Want another size, wood or finish? Send us a request. We reply with a price and making time, and you pay nothing until you agree.
      </p>
      <div className="row">
        <Link href={`/custom?${q.toString()}`} className="btn outline">
          Ask for this custom version
        </Link>
      </div>
    </section>
  );
}
