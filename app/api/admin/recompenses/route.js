import { makeListRoute } from "../../../../lib/make-list-route";

export const { GET, POST } = makeListRoute({
  path: "content/recompenses.json",
  label: "Récompenses",
  commitMessage: "Récompenses : mise à jour depuis l'admin",
});
