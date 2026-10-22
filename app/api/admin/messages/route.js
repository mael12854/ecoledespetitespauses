import { makeListRoute } from "../../../../lib/make-list-route";

export const { GET, POST } = makeListRoute({
  path: "content/messages.json",
  label: "Messages",
  commitMessage: "Messages : mise à jour depuis l'admin",
});
