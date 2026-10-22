import { makeListRoute } from "../../../../lib/make-list-route";

export const { GET, POST } = makeListRoute({
  path: "content/notes.json",
  label: "Carnet de notes",
  commitMessage: "Carnet de notes : mise à jour depuis l'admin",
});
