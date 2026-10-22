import recompenses from "../../content/recompenses.json";

export const metadata = {
  title: "Récompenses — L'École des Petites Pauses",
};

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function RecompensesPage() {
  const sorted = [...recompenses].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const tally = [];
  for (const r of recompenses) {
    const row = tally.find((t) => t.eleve === r.eleve);
    if (row) row.count += 1;
    else tally.push({ eleve: r.eleve, count: 1 });
  }
  tally.sort((a, b) => b.count - a.count);

  return (
    <main className="page">
      <section className="card" aria-label="Récompenses">
        <div className="kicker">Le tableau des tampons</div>
        <h2>Les récompenses</h2>
        {tally.length > 0 ? (
          <div className="tally-grid">
            {tally.map((t) => (
              <div className="tally-card" key={t.eleve}>
                <div className="tally-card__count">{t.count}</div>
                <div className="tally-card__eleve">{t.eleve}</div>
              </div>
            ))}
          </div>
        ) : null}
        {sorted.length === 0 ? (
          <p className="schedule-intro">Pas encore de tampon distribué.</p>
        ) : (
          <div className="devoirs-list">
            {sorted.map((r) => (
              <article className="stamp" key={r.id}>
                <div className="stamp__tampon">{r.tampon || "⭐"}</div>
                <div className="stamp__body">
                  <div className="devoir__meta">
                    <span className="devoir__eleve">{r.eleve}</span>
                    {r.date ? <span className="devoir__date">{formatDate(r.date)}</span> : null}
                  </div>
                  {r.motif ? <p className="devoir__desc">{r.motif}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
