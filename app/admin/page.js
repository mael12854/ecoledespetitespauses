"use client";

import { useEffect, useState } from "react";
import { Field } from "./fields";
import { getSupabase } from "../../lib/supabase-client";

const TOKEN_KEY = "eppp_admin_token";
const CANTINE_IDS = ["mael", "adeline", "renaud"];

async function adminFetch(url, token, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Erreur ${res.status}`);
  return json;
}

function useSavedFlash() {
  const [message, setMessage] = useState(null);
  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }
  return [message, flash];
}

export default function AdminPage() {
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [tab, setTab] = useState("devoirs");

  useEffect(() => {
    try {
      setToken(localStorage.getItem(TOKEN_KEY));
    } catch {}
    setHydrated(true);
  }, []);

  function connect() {
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem(TOKEN_KEY, trimmed);
    } catch {}
    setToken(trimmed);
    setTokenInput("");
  }

  function disconnect() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
    setToken(null);
  }

  if (!hydrated) {
    return (
      <main className="page">
        <p className="schedule-intro">Chargement…</p>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="page">
        <section className="card" style={{ gap: 18 }}>
          <div className="kicker">Admin</div>
          <h2>Connexion</h2>
          <p className="schedule-intro">
            Colle ton token GitHub (fine-grained, accès en écriture sur ce seul repo). Il reste dans ton navigateur —
            il n'est jamais envoyé ailleurs qu'à GitHub, via ce site.
          </p>
          <Field label="Token GitHub" value={tokenInput} onChange={setTokenInput} />
          <button className="admin-btn admin-btn--primary" onClick={connect} disabled={!tokenInput.trim()}>
            Se connecter
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <div className="admin-header">
          <div>
            <div className="kicker">Admin</div>
            <h2>Bonjour !</h2>
          </div>
          <button className="admin-btn" onClick={disconnect}>
            Oublier le token
          </button>
        </div>
        <div className="admin-tabs">
          {[
            ["devoirs", "Devoirs"],
            ["fiches", "Fiches prof"],
            ["messages", "Messages"],
            ["planning", "Emploi du temps"],
            ["recompenses", "Récompenses"],
            ["notes", "Carnet de notes"],
            ["galerie", "Galerie"],
            ["cantine", "Cartes de cantine"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`admin-tab${tab === key ? " admin-tab--active" : ""}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {tab === "devoirs" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/devoirs"
          title="Devoirs"
          emptyText="Aucun devoir pour l'instant."
          makeEmpty={() => ({
            id: `d-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            eleve: "Maël",
            matiere: "",
            titre: "",
            description: "",
            date: "",
            fait: false,
          })}
          fields={[
            { key: "eleve", label: "Élève" },
            { key: "matiere", label: "Matière" },
            { key: "titre", label: "Titre" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "date", label: "Date", type: "date" },
            { key: "fait", label: "Fait", type: "checkbox" },
          ]}
        />
      )}
      {tab === "fiches" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/fiches"
          title="Fiches prof"
          emptyText="Le classeur est vide."
          makeEmpty={() => ({
            id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            matiere: "",
            titre: "",
            contenu: "",
            date: "",
          })}
          fields={[
            { key: "matiere", label: "Matière" },
            { key: "titre", label: "Titre" },
            { key: "contenu", label: "Contenu", type: "textarea" },
            { key: "date", label: "Date", type: "date" },
          ]}
        />
      )}
      {tab === "messages" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/messages"
          title="Messages"
          emptyText="Aucun message."
          makeEmpty={() => ({
            id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            auteur: "",
            texte: "",
            date: new Date().toISOString(),
          })}
          fields={[
            { key: "auteur", label: "Auteur" },
            { key: "texte", label: "Message", type: "textarea" },
          ]}
        />
      )}
      {tab === "planning" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/planning"
          title="Emploi du temps"
          emptyText="Rien de programmé pour l'instant."
          makeEmpty={() => ({
            id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            jour: "Lundi",
            debut: "",
            fin: "",
            matiere: "",
            eleve: "",
          })}
          fields={[
            { key: "jour", label: "Jour", type: "select", options: JOURS },
            { key: "debut", label: "Début", type: "time" },
            { key: "fin", label: "Fin", type: "time" },
            { key: "matiere", label: "Matière" },
            { key: "eleve", label: "Élève" },
          ]}
        />
      )}
      {tab === "recompenses" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/recompenses"
          title="Récompenses"
          emptyText="Pas encore de tampon distribué."
          makeEmpty={() => ({
            id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            eleve: "Marin",
            tampon: "⭐",
            motif: "",
            date: new Date().toISOString().slice(0, 10),
          })}
          fields={[
            { key: "eleve", label: "Élève" },
            { key: "tampon", label: "Tampon (emoji)" },
            { key: "motif", label: "Motif", type: "textarea" },
            { key: "date", label: "Date", type: "date" },
          ]}
        />
      )}
      {tab === "notes" && (
        <AdminListEditor
          token={token}
          endpoint="/api/admin/notes"
          title="Carnet de notes"
          emptyText="Aucune évaluation pour l'instant."
          makeEmpty={() => ({
            id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            eleve: "Maël",
            matiere: "",
            titre: "",
            note: "",
            appreciation: "",
            date: new Date().toISOString().slice(0, 10),
          })}
          fields={[
            { key: "eleve", label: "Élève" },
            { key: "matiere", label: "Matière" },
            { key: "titre", label: "Titre" },
            { key: "note", label: "Note" },
            { key: "appreciation", label: "Appréciation", type: "textarea" },
            { key: "date", label: "Date", type: "date" },
          ]}
        />
      )}
      {tab === "galerie" && <GalerieEditor token={token} />}
      {tab === "cantine" && <CartesCantineEditor />}
    </main>
  );
}

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function AdminListEditor({ token, endpoint, title, emptyText, makeEmpty, fields }) {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, flash] = useSavedFlash();

  useEffect(() => {
    adminFetch(endpoint, token)
      .then(setList)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [token, endpoint]);

  function updateAt(i, patch) {
    setList((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await adminFetch(endpoint, token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      flash("Enregistré ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="card"><p className="schedule-intro">Chargement…</p></section>;
  if (!list) return <section className="card"><p className="admin-error">{error || "Impossible de charger le contenu."}</p></section>;

  return (
    <section className="card">
      <h2>{title}</h2>
      {list.length === 0 ? <p className="schedule-intro">{emptyText}</p> : null}
      {list.map((item, i) => (
        <div className="admin-devoir-row" key={item.id}>
          {fields.map((f) =>
            f.type === "checkbox" ? (
              <label className="admin-field admin-field--checkbox" key={f.key}>
                <input type="checkbox" checked={!!item[f.key]} onChange={(e) => updateAt(i, { [f.key]: e.target.checked })} />
                <span>{f.label}</span>
              </label>
            ) : f.type === "date" || f.type === "time" ? (
              <label className="admin-field" key={f.key}>
                <span className="admin-field__label">{f.label}</span>
                <input
                  className="admin-field__input"
                  type={f.type}
                  value={item[f.key] || ""}
                  onChange={(e) => updateAt(i, { [f.key]: e.target.value })}
                />
              </label>
            ) : f.type === "select" ? (
              <label className="admin-field" key={f.key}>
                <span className="admin-field__label">{f.label}</span>
                <select
                  className="admin-field__input"
                  value={item[f.key] || ""}
                  onChange={(e) => updateAt(i, { [f.key]: e.target.value })}
                >
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <Field
                key={f.key}
                label={f.label}
                value={item[f.key]}
                onChange={(v) => updateAt(i, { [f.key]: v })}
                textarea={f.type === "textarea"}
              />
            )
          )}
          <button
            type="button"
            className="admin-btn admin-btn--danger"
            onClick={() => setList((prev) => prev.filter((_, idx) => idx !== i))}
          >
            Supprimer
          </button>
          <hr className="admin-divider" />
        </div>
      ))}
      <button type="button" className="admin-btn" onClick={() => setList((prev) => [...prev, makeEmpty()])}>
        + Ajouter
      </button>

      <div className="admin-save-bar">
        {error ? <p className="admin-error">{error}</p> : null}
        {message ? <p className="admin-success">{message}</p> : null}
        <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer sur GitHub"}
        </button>
      </div>
    </section>
  );
}

function GalerieEditor({ token }) {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newLegende, setNewLegende] = useState("");
  const [error, setError] = useState(null);
  const [message, flash] = useSavedFlash();

  useEffect(() => {
    adminFetch("/api/admin/galerie", token)
      .then(setList)
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false));
  }, [token]);

  function updateAt(i, patch) {
    setList((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  async function uploadPhoto(file) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("legende", newLegende);
      const res = await adminFetch("/api/admin/galerie-photo", token, { method: "POST", body: form });
      setList((prev) => [...(prev || []), res.entry]);
      setNewLegende("");
      flash("Photo ajoutée ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await adminFetch("/api/admin/galerie", token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      flash("Enregistré ! Le site va se reconstruire dans une minute ou deux.");
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <section className="card"><p className="schedule-intro">Chargement…</p></section>;
  if (!list) return <section className="card"><p className="admin-error">{error || "Impossible de charger le contenu."}</p></section>;

  return (
    <section className="card">
      <h2>Galerie</h2>
      {error ? <p className="admin-error">{error}</p> : null}
      {message ? <p className="admin-success">{message}</p> : null}

      <div className="admin-field">
        <span className="admin-field__label">Ajouter une photo</span>
        <Field label="Légende" value={newLegende} onChange={setNewLegende} />
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadPhoto(file);
            e.target.value = "";
          }}
        />
        {uploading ? <span className="admin-field__label">Envoi…</span> : null}
      </div>

      <hr className="admin-divider" />

      {list.length === 0 ? <p className="schedule-intro">Pas encore de photo.</p> : null}
      <div className="admin-grid admin-grid--2">
        {list.map((item, i) => (
          <div className="admin-photo-slot" key={item.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.legende || ""} className="admin-photo-slot__preview" />
            <Field label="Légende" value={item.legende} onChange={(v) => updateAt(i, { legende: v })} />
            <label className="admin-field">
              <span className="admin-field__label">Date</span>
              <input
                className="admin-field__input"
                type="date"
                value={(item.date || "").slice(0, 10)}
                onChange={(e) => updateAt(i, { date: e.target.value })}
              />
            </label>
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={() => setList((prev) => prev.filter((_, idx) => idx !== i))}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="admin-save-bar">
        <button className="admin-btn admin-btn--primary" onClick={save} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer sur GitHub"}
        </button>
      </div>
    </section>
  );
}

function formatCardNumber(n) {
  return String(n || "")
    .replace(/\s+/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function CartesCantineEditor() {
  const [accounts, setAccounts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabase();
    } catch (e) {
      setError(e.message);
      return;
    }
    supabase
      .from("accounts")
      .select("id, holder_name, card_number, expiry, express_code")
      .in("id", CANTINE_IDS)
      .eq("archived", false)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setAccounts(data);
      });
  }, []);

  return (
    <section className="card cantine-screen-only">
      <div className="admin-header">
        <div>
          <div className="kicker">Crédit Domestique</div>
          <h2>Cartes de cantine</h2>
        </div>
        {accounts?.length ? (
          <button type="button" className="admin-btn admin-btn--primary" onClick={() => window.print()}>
            Imprimer
          </button>
        ) : null}
      </div>
      <p className="schedule-intro">
        Une carte par élève, avec son code — à découper et donner à qui doit payer à la cantine avec son Crédit
        Domestique.
      </p>
      {error ? <p className="admin-error">{error}</p> : null}
      {!accounts ? (
        <p className="schedule-intro">Chargement…</p>
      ) : (
        <div className="cantine-cards">
          {accounts.map((a) => (
            <div className="cantine-card" key={a.id}>
              <div className="cantine-card__top">
                <span className="cantine-card__brand">École des Petites Pauses</span>
                <span className="cantine-card__brand2">Carte de cantine</span>
              </div>
              <div className="cantine-card__name">{a.holder_name}</div>
              <div className="cantine-card__number">{formatCardNumber(a.card_number) || "···· ···· ···· ····"}</div>
              <div className="cantine-card__bottom">
                <div>
                  <div className="cantine-card__label">Expire</div>
                  <div className="cantine-card__value">{a.expiry || "--/--"}</div>
                </div>
                <div>
                  <div className="cantine-card__label">Code</div>
                  <div className="cantine-card__value cantine-card__value--code">{a.express_code || "----"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
