import planning from "../../content/planning.json";

export const metadata = {
  title: "Emploi du temps — L'École des Petites Pauses",
};

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function PlanningPage() {
  const byJour = JOURS.map((jour) => ({
    jour,
    creneaux: planning
      .filter((p) => p.jour === jour)
      .sort((a, b) => (a.debut || "").localeCompare(b.debut || "")),
  })).filter((g) => g.creneaux.length > 0);

  return (
    <main className="page">
      <section className="card" aria-label="Emploi du temps">
        <div className="kicker">Planning de la semaine</div>
        <h2>L'emploi du temps</h2>
        {byJour.length === 0 ? (
          <p className="schedule-intro">Rien de programmé pour l'instant. Le directeur décide au jour le jour.</p>
        ) : (
          <div className="planning">
            {byJour.map((g) => (
              <div className="planning-day" key={g.jour}>
                <div className="planning-day__title">{g.jour}</div>
                <div className="planning-day__rows">
                  {g.creneaux.map((c) => (
                    <div className="planning-row" key={c.id}>
                      <span className="planning-row__time">
                        {c.debut}
                        {c.fin ? ` – ${c.fin}` : ""}
                      </span>
                      <span className="planning-row__matiere">{c.matiere}</span>
                      {c.eleve ? <span className="planning-row__eleve">{c.eleve}</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
