import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "L'École des Petites Pauses",
  description: "Devoirs, fiches prof, messages et plus de L'École des Petites Pauses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Karla:wght@400;500;700&family=Caveat:wght@600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--paper)" }}>
          <nav className="site-nav" style={{ marginTop: "clamp(14px, 3vw, 24px)" }}>
            <Link href="/">Accueil</Link>
            <Link href="/devoirs">Devoirs</Link>
            <Link href="/fiches">Fiches prof</Link>
            <Link href="/messages">Messages</Link>
            <Link href="/planning">Emploi du temps</Link>
            <Link href="/recompenses">Récompenses</Link>
            <Link href="/carnet">Carnet de notes</Link>
            <Link href="/galerie">Galerie</Link>
            <Link href="/espace">Espace élève</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </div>
        {children}
      </body>
    </html>
  );
}
