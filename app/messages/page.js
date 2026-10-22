import messages from "../../content/messages.json";

export const metadata = {
  title: "Messages — L'École des Petites Pauses",
};

function formatDateTime(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function MessagesPage() {
  const sorted = [...messages].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <main className="page">
      <section className="card" aria-label="Messages">
        <div className="kicker">Panneau d'affichage</div>
        <h2>Les messages de l'école</h2>
        <p className="schedule-intro">Changements d'horaire, annonces, petits mots — tout ce que le directeur veut faire savoir.</p>
        {sorted.length === 0 ? (
          <p className="schedule-intro">Rien d'affiché pour l'instant.</p>
        ) : (
          <div className="devoirs-list">
            {sorted.map((m) => (
              <article className="message" key={m.id}>
                <div className="message__meta">
                  <span className="message__auteur">{m.auteur}</span>
                  {m.date ? <span className="message__date">{formatDateTime(m.date)}</span> : null}
                </div>
                <p className="message__texte">{m.texte}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
