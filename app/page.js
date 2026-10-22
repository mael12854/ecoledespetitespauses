export const metadata = {
  title: "L'École des Petites Pauses",
};

const LIENS = [
  { href: "/devoirs", label: "Devoirs", desc: "Le cahier de textes de la semaine." },
  { href: "/fiches", label: "Fiches prof", desc: "Le classeur des fiches." },
  { href: "/messages", label: "Messages", desc: "Le panneau d'affichage de l'école." },
  { href: "/planning", label: "Emploi du temps", desc: "Le planning, jour par jour." },
  { href: "/recompenses", label: "Récompenses", desc: "Le tableau des tampons." },
  { href: "/carnet", label: "Carnet de notes", desc: "Les évaluations, élève par élève." },
  { href: "/galerie", label: "Galerie", desc: "Les photos de la vie de l'école." },
  { href: "/espace", label: "Espace élève", desc: "Se connecter et payer avec le Crédit Domestique." },
];

export default function HomePage() {
  return (
    <main className="page">
      <section className="card" aria-label="Accueil">
        <div className="kicker">École des Petites Pauses</div>
        <h2>L'École des Petites Pauses</h2>
        <p className="schedule-intro" style={{ fontFamily: "var(--font-hand)", fontSize: 24 }}>
          « ça veut dire : on s'arrête un peu, et après on recommence »
        </p>
        <div className="devoirs-list">
          {LIENS.map((l) => (
            <a className="devoir" href={l.href} key={l.href}>
              <h3 className="devoir__titre">{l.label}</h3>
              <p className="devoir__desc">{l.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
