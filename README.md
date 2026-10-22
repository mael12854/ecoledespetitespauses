# École des Petites Pauses

Site de « L'École des Petites Pauses » : le cahier de textes (devoirs), les fiches prof, un panneau de messages, l'emploi du temps, les récompenses, le carnet de notes, une galerie photos, l'espace élève (Crédit Domestique), et une interface d'administration pour tout modifier sans toucher au code. App Next.js (App Router), pensée pour Vercel.

> Ce repo a été reconstruit après la suppression accidentelle du dépôt d'origine. La charte de marque (page d'accueil illustrée, couleurs/typographies/règlement personnalisés) a été volontairement abandonnée — elle n'est plus affichée sur le site.

## Structure

- `app/page.js` — page d'accueil minimale, liens vers toutes les sections.
- `app/devoirs/page.js` — liste publique des devoirs, depuis `content/devoirs.json`.
- `app/fiches/page.js` — liste publique des fiches prof (le classeur), depuis `content/fiches.json`.
- `app/messages/page.js` — panneau d'annonces (changements d'horaire, etc.), depuis `content/messages.json`.
- `app/planning/page.js` — emploi du temps interactif, groupé par jour, depuis `content/planning.json`.
- `app/recompenses/page.js` — tableau des tampons/récompenses par élève, depuis `content/recompenses.json`.
- `app/carnet/page.js` — carnet de notes et évaluations par élève, depuis `content/notes.json`.
- `app/galerie/page.js` — galerie photos de la vie de l'école, depuis `content/galerie.json`.
- `app/espace/page.js` — espace élève : on choisit son profil, on entre son code, on voit son solde de Crédit Domestique et on paye (ou refuse) les « trucs à payer » en attente. Branché sur Supabase (projet **Credit-Domestique**), pas sur `content/*.json`.
- `app/admin/` — interface d'administration : gestion des devoirs, des fiches, des messages, de l'emploi du temps, des récompenses, du carnet de notes, de la galerie (avec upload de photos), et génération des cartes de cantine.
- `app/api/admin/*` — routes serveur appelées par l'admin ; elles committent directement les changements sur GitHub via l'API Contents.
- `content/*.json` — le contenu du site, versionné dans le repo. Modifier ces fichiers (à la main ou via l'admin) et pousser sur `main` republie automatiquement le site sur Vercel.
- `lib/supabase-client.js` — client Supabase partagé par l'espace élève et l'onglet « Cartes de cantine » de l'admin.

## Développement local

```
npm install
npm run dev
```

## Mise en route

### 1. Connecter le repo à Vercel

Sur [vercel.com](https://vercel.com), importer ce dépôt. Chaque push sur `main` (y compris ceux faits par l'admin) redéploie automatiquement. **Aucune variable d'environnement n'est nécessaire** pour que ça fonctionne (voir plus bas pour l'espace élève).

### 2. Utiliser l'admin (`/admin`)

Pas de compte à créer, pas d'app OAuth à configurer : l'admin demande juste un **token GitHub**, collé une fois dans le navigateur (stocké en local, jamais envoyé ailleurs qu'à GitHub via ce site).

Pour créer ce token : [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new) → **fine-grained token** :
- **Repository access** : uniquement ce dépôt (surtout pas « tous les repos »)
- **Permissions** : `Contents` → **Read and write**

Donne ce token à qui doit pouvoir modifier le site (toute la famille peut avoir le même, ou un chacun). Comme il n'a accès qu'à ce seul repo, un token qui fuite ne met en danger que ce site — pas le reste du compte GitHub.

Une fois collé dans `/admin`, chaque « Enregistrer » fait un vrai commit sur `main` qui republie le site en une à deux minutes.

### 3. L'espace élève et le Crédit Domestique

`/espace` et l'onglet **Cartes de cantine** de l'admin se branchent sur un projet Supabase existant (« Credit-Domestique ») qui tient les comptes, le grand livre et les « trucs à payer » (`charges`) de la petite banque familiale. L'URL et la clé publique du projet sont dans `vercel.json` (`build.env` / `env`) — pas besoin de les configurer dans le dashboard Vercel, ça reste zéro-config. C'est une clé *publishable*, faite pour être publique, protégée par les policies RLS du projet (pas par le secret) ; `lib/supabase-client.js` les lit via `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (utiliser un `.env.local` — non versionné — pour les redéfinir en local).

Élèves qui ont accès à l'espace élève et aux cartes de cantine (liste fermée dans `ELEVE_IDS` / `CANTINE_IDS`) : Maël, Adeline, Renaud. La connexion se fait par un code à 4 chiffres (le PIN déjà stocké sur chaque compte) ; la vérification se fait côté base (fonctions SQL `login_account` et `respond_charge`), pour que le code ne transite jamais en clair vers le navigateur.

⚠️ Les policies RLS de ce projet Supabase sont ouvertes en lecture/écriture à la clé publique (pas d'auth réelle) : c'est voulu pour un jeu familial, mais ne pas y mettre de vraie donnée sensible.
