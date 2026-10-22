import galerie from "../../content/galerie.json";

export const metadata = {
  title: "Galerie — L'École des Petites Pauses",
};

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function GaleriePage() {
  const sorted = [...galerie].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <main className="page">
      <section className="card" aria-label="Galerie">
        <div className="kicker">La vie de l'école</div>
        <h2>La galerie photos</h2>
        {sorted.length === 0 ? (
          <p className="schedule-intro">Pas encore de photo dans la galerie.</p>
        ) : (
          <div className="galerie-grid">
            {sorted.map((g) => (
              // eslint-disable-next-line @next/next/no-img-element
              <figure className="galerie-item" key={g.id}>
                <img src={g.url} alt={g.legende || ""} className="galerie-item__img" />
                {g.legende || g.date ? (
                  <figcaption className="galerie-item__caption">
                    {g.legende}
                    {g.date ? <span className="galerie-item__date">{formatDate(g.date)}</span> : null}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
