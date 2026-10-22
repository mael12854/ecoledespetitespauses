import { NextResponse } from "next/server";

// The admin panel sends the GitHub token the operator pasted in, as a
// bearer token, on every request. We never store it server-side — it's
// read here and handed straight to lib/github.js for that one request.
export function requireAdminToken(request) {
  const header = request.headers.get("authorization") || "";
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  const token = match?.[1]?.trim();
  if (!token) {
    return { token: null, error: NextResponse.json({ error: "Token GitHub manquant." }, { status: 401 }) };
  }
  return { token, error: null };
}
