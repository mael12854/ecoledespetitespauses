import fiches from "../../content/fiches.json";

export const metadata = {
  title: "Fiches prof — L'École des Petites Pauses",
};

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function FichesPage() {
  const sorted = [...fiches].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <main className="page">
      <section className="card" aria-label="Fiches prof">
        <div className="kicker">Le classeur</div>
        <h2>Les fiches prof</h2>
        {sorted.length === 0 ? (
          <p className="schedule-intro">Le classeur est vide pour l'instant.</p>
        ) : (
          <div className="devoirs-list">
            {sorted.map((f) => (
              <article className="devoir" key={f.id}>
                <div className="devoir__meta">
                  <span className="devoir__matiere">{f.matiere}</span>
                  {f.date ? <span className="devoir__date">{formatDate(f.date)}</span> : null}
                </div>
                <h3 className="devoir__titre">{f.titre}</h3>
                {f.contenu ? <p className="devoir__desc">{f.contenu}</p> : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
