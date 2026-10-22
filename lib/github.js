// Server-only helper: commits file changes straight to the repo via the
// GitHub Contents API. The token is supplied per-request by the admin
// panel (never read from a server env var, never persisted) — see
// lib/require-admin-token.js. Never import this from client code.

const API_ROOT = "https://api.github.com";

function repoInfo() {
  const owner = process.env.GH_REPO_OWNER || "mael12854";
  const repo = process.env.GH_REPO_NAME || "ecoledespetitespauses";
  const branch = process.env.GH_BRANCH || "main";
  return { owner, repo, branch };
}

function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// Returns { sha, content (utf8 string) } or null if the file doesn't exist yet.
export async function getFile(path, token) {
  const { owner, repo, branch } = repoInfo();
  const url = `${API_ROOT}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub a refusé la lecture (${res.status}) : ${await res.text()}`);
  }
  const data = await res.json();
  const content = Buffer.from(data.content, data.encoding || "base64").toString("utf8");
  return { sha: data.sha, content };
}

// contentInput: a utf8 string, or a Buffer for binary files (e.g. images).
export async function putFile(path, contentInput, message, token) {
  const { owner, repo, branch } = repoInfo();
  const existing = await getFile(path, token).catch(() => null);
  const contentBase64 = Buffer.isBuffer(contentInput)
    ? contentInput.toString("base64")
    : Buffer.from(contentInput, "utf8").toString("base64");

  const url = `${API_ROOT}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch,
      sha: existing?.sha,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401) {
      throw new Error("Token GitHub invalide ou expiré.");
    }
    if (res.status === 403) {
      throw new Error("Ce token n'a pas le droit d'écrire sur ce repo (permission Contents: Read and write requise).");
    }
    throw new Error(`GitHub a refusé l'écriture (${res.status}) : ${body}`);
  }
  return res.json();
}

export async function putJsonFile(path, data, message, token) {
  return putFile(path, JSON.stringify(data, null, 2) + "\n", message, token);
}
