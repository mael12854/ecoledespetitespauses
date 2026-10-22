import { NextResponse } from "next/server";
import { requireAdminToken } from "./require-admin-token";
import { getFile, putJsonFile } from "./github";

// Shared shape for the devoirs / fiches / messages / planning /
// recompenses / notes / galerie routes: a single JSON file holding an
// array, read in full and overwritten in full.
export function makeListRoute({ path, label, commitMessage }) {
  async function GET(request) {
    const { token, error } = requireAdminToken(request);
    if (error) return error;
    try {
      const file = await getFile(path, token);
      return NextResponse.json(file ? JSON.parse(file.content) : []);
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  async function POST(request) {
    const { token, error } = requireAdminToken(request);
    if (error) return error;

    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: `${label} : la liste doit être un tableau` }, { status: 400 });
    }

    try {
      await putJsonFile(path, body, commitMessage, token);
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  return { GET, POST };
}
