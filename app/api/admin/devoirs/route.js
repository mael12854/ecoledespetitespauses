import { makeListRoute } from "../../../../lib/make-list-route";

export const { GET, POST } = makeListRoute({
  path: "content/devoirs.json",
  label: "Devoirs",
  commitMessage: "Devoirs : mise à jour depuis l'admin",
});
