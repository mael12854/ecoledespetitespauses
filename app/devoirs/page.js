import devoirs from "../../content/devoirs.json";

export const metadata = {
  title: "Les devoirs — L'École des Petites Pauses",
};

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function DevoirsPage() {
  const sorted = [...devoirs].sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  return (
    <main className="page">
      <section className="card" aria-label="Devoirs">
        <div className="kicker">Cahier de textes</div>
        <h2>Les devoirs de la semaine</h2>
        {sorted.length === 0 ? (
          <p className="schedule-intro">Rien pour l'instant. Le directeur est en pause.</p>
        ) : (
          <div className="devoirs-list">
            {sorted.map((d) => (
              <article className={`devoir${d.fait ? " devoir--fait" : ""}`} key={d.id}>
                <div className="devoir__meta">
                  <span className="devoir__eleve">{d.eleve}</span>
                  <span className="devoir__matiere">{d.matiere}</span>
                  {d.date ? <span className="devoir__date">{formatDate(d.date)}</span> : null}
                </div>
                <h3 className="devoir__titre">{d.titre}</h3>
                {d.description ? <p className="devoir__desc">{d.description}</p> : null}
                {d.fait ? <div className="devoir__badge">fait ✓</div> : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
