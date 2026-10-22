import { makeListRoute } from "../../../../lib/make-list-route";

export const { GET, POST } = makeListRoute({
  path: "content/galerie.json",
  label: "Galerie",
  commitMessage: "Galerie : mise à jour depuis l'admin",
});
