"use client";

import { createClient } from "@supabase/supabase-js";

// Supabase project for "Crédit Domestique" (la petite banque familiale),
// used by /espace and the admin's "Cartes de cantine" tab. The URL and
// publishable/anon key are meant to be public — they're only usable
// through the Row Level Security policies configured on the project,
// exactly like a Firebase web config — but they still live in env vars
// (set on Vercel) rather than in source, so they can be rotated without a
// code change. Never put the service_role key here.
//
// Built lazily (not at module scope) so importing this file doesn't blow
// up Next's build-time prerender when the env vars aren't set locally —
// only actually calling getSupabase() from a browser effect/handler does.
let client = null;

export function getSupabase() {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Supabase non configuré : il manque NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }
    client = createClient(url, key);
  }
  return client;
}
