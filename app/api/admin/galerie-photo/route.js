import { NextResponse } from "next/server";
import { requireAdminToken } from "../../../../lib/require-admin-token";
import { getFile, putFile, putJsonFile } from "../../../../lib/github";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB, comfortably under Vercel's serverless body limit
const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request) {
  const { token, error } = requireAdminToken(request);
  if (error) return error;

  const form = await request.formData();
  const file = form.get("file");
  const legende = String(form.get("legende") || "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Format d'image non supporté (jpg, png, webp, gif)" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image trop lourde (4 Mo max)" }, { status: 400 });
  }

  const id = `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const path = `public/photos/galerie/${id}.${ext}`;
  const url = `/photos/galerie/${id}.${ext}`;
  const date = new Date().toISOString();

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await putFile(path, buffer, `Galerie : nouvelle photo`, token);

    const current = await getFile("content/galerie.json", token);
    const galerie = current ? JSON.parse(current.content) : [];
    const entry = { id, url, legende, date };
    galerie.push(entry);
    await putJsonFile("content/galerie.json", galerie, `Galerie : ajout d'une photo`, token);

    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
