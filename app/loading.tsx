export default function Loading() {
  return (
    <section className="section" aria-busy="true">
      <div className="wrap">
        <p className="muted" role="status">
          Loading…
        </p>
      </div>
    </section>
  );
}
