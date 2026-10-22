import { makeListRoute } from "../../../../lib/make-list-route";

export const { GET, POST } = makeListRoute({
  path: "content/planning.json",
  label: "Emploi du temps",
  commitMessage: "Emploi du temps : mise à jour depuis l'admin",
});
