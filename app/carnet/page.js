import notes from "../../content/notes.json";

export const metadata = {
  title: "Carnet de notes — L'École des Petites Pauses",
};

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function CarnetPage() {
  const eleves = [];
  for (const n of notes) {
    if (!eleves.includes(n.eleve)) eleves.push(n.eleve);
  }

  return (
    <main className="page">
      <section className="card" aria-label="Carnet de notes">
        <div className="kicker">Bulletin</div>
        <h2>Le carnet de notes</h2>
        {eleves.length === 0 ? (
          <p className="schedule-intro">Aucune évaluation pour l'instant.</p>
        ) : (
          eleves.map((eleve) => {
            const rows = notes
              .filter((n) => n.eleve === eleve)
              .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
            return (
              <div className="carnet-eleve" key={eleve}>
                <h3 className="carnet-eleve__nom">{eleve}</h3>
                <div className="devoirs-list">
                  {rows.map((n) => (
                    <article className="devoir" key={n.id}>
                      <div className="devoir__meta">
                        <span className="devoir__matiere">{n.matiere}</span>
                        {n.date ? <span className="devoir__date">{formatDate(n.date)}</span> : null}
                        {n.note ? <span className="carnet-note">{n.note}</span> : null}
                      </div>
                      <h4 className="devoir__titre">{n.titre}</h4>
                      {n.appreciation ? <p className="devoir__desc">{n.appreciation}</p> : null}
                    </article>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}
