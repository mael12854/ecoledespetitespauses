import { makeListRoute } from "../../../../lib/make-list-route";

export const { GET, POST } = makeListRoute({
  path: "content/fiches.json",
  label: "Fiches prof",
  commitMessage: "Fiches prof : mise à jour depuis l'admin",
});
