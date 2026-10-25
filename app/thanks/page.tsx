import type { Metadata } from "next";
import { ThanksView } from "@/components/ThanksView";

export const metadata: Metadata = { title: "Thank you" };

export default function ThanksPage() {
  return (
    <section className="section warm" style={{ minHeight: "60vh" }}>
      <div className="wrap">
        <ThanksView />
      </div>
    </section>
  );
}
