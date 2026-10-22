"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../../lib/supabase-client";

// Qui a accès à l'espace élève — liste fermée, pas basée sur le rôle en base.
const ELEVE_IDS = ["mael", "adeline", "renaud"];

function formatMontant(n) {
  return `${Number(n ?? 0).toLocaleString("fr-FR")} CD`;
}

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  } catch {
    return iso;
  }
}

export default function EspaceElevePage() {
  const [profiles, setProfiles] = useState(null);
  const [profilesError, setProfilesError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [pin, setPin] = useState("");
  const [session, setSession] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabase();
    } catch (e) {
      setProfilesError(e.message);
      return;
    }
    supabase
      .from("accounts")
      .select("id, holder_name")
      .in("id", ELEVE_IDS)
      .eq("archived", false)
      .then(({ data, error }) => {
        if (error) setProfilesError(error.message);
        else setProfiles(data);
      });
  }, []);

  async function login() {
    if (!selected || pin.trim().length === 0) return;
    setLoggingIn(true);
    setLoginError(null);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.rpc("login_account", {
        p_account_id: selected,
        p_code: pin.trim(),
      });
      if (error) throw error;
      if (!data || data.length === 0) {
        setLoginError("Identifiant ou code incorrect.");
        return;
      }
      setSession({ ...data[0], pin: pin.trim() });
    } catch (e) {
      setLoginError(String(e.message || e));
    } finally {
      setLoggingIn(false);
    }
  }

  function logout() {
    setSession(null);
    setSelected(null);
    setPin("");
  }

  if (!session) {
    return (
      <main className="page">
        <section className="card" aria-label="Espace élève">
          <div className="kicker">Connexion</div>
          <h2>L'espace élève</h2>
          {profilesError ? <p className="admin-error">{profilesError}</p> : null}
          {!profiles ? (
            <p className="schedule-intro">Chargement…</p>
          ) : (
            <div className="espace-profiles">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`espace-profile${selected === p.id ? " espace-profile--active" : ""}`}
                  onClick={() => {
                    setSelected(p.id);
                    setLoginError(null);
                  }}
                >
                  {p.holder_name}
                </button>
              ))}
            </div>
          )}
          {selected ? (
            <div className="espace-login">
              <label className="admin-field">
                <span className="admin-field__label">Code (PIN)</span>
                <input
                  className="admin-field__input"
                  type="password"
                  inputMode="numeric"
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && login()}
                />
              </label>
              {loginError ? <p className="admin-error">{loginError}</p> : null}
              <button className="admin-btn admin-btn--primary" onClick={login} disabled={loggingIn || !pin.trim()}>
                {loggingIn ? "Connexion…" : "Se connecter"}
              </button>
            </div>
          ) : null}
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <EspaceDashboard session={session} onLogout={logout} onBalanceChange={(b) => setSession((s) => ({ ...s, balance: b }))} />
    </main>
  );
}

function EspaceDashboard({ session, onLogout, onBalanceChange }) {
  const [charges, setCharges] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [flashMsg, setFlashMsg] = useState(null);

  function reload() {
    let supabase;
    try {
      supabase = getSupabase();
    } catch (e) {
      setError(e.message);
      return;
    }
    supabase
      .from("charges")
      .select("id, amount, reason, requested_at, company:accounts!charges_company_id_fkey(holder_name)")
      .eq("payer_id", session.id)
      .eq("status", "pending")
      .order("requested_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setCharges(data);
      });
  }

  useEffect(reload, [session.id]);

  async function respond(chargeId, accept) {
    setBusyId(chargeId);
    setError(null);
    setFlashMsg(null);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.rpc("respond_charge", {
        p_charge_id: chargeId,
        p_account_id: session.id,
        p_code: session.pin,
        p_accept: accept,
      });
      if (error) throw error;
      const result = data?.[0];
      if (!result?.ok) {
        setError(result?.message || "Une erreur est survenue.");
        return;
      }
      setFlashMsg(result.message);
      if (typeof result.new_balance === "number") onBalanceChange(result.new_balance);
      setCharges((prev) => prev.filter((c) => c.id !== chargeId));
      setTimeout(() => setFlashMsg(null), 3000);
    } catch (e) {
      setError(String(e.message || e));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="card" aria-label="Tableau de bord élève">
      <div className="admin-header">
        <div>
          <div className="kicker">Bonjour</div>
          <h2>{session.holder_name}</h2>
        </div>
        <button className="admin-btn" onClick={onLogout}>
          Changer de profil
        </button>
      </div>

      <div className="espace-balance">
        <div className="espace-balance__label">Solde Crédit Domestique</div>
        <div className="espace-balance__value">{formatMontant(session.balance)}</div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {flashMsg ? <p className="admin-success">{flashMsg}</p> : null}

      <h3>Les trucs à payer</h3>
      {!charges ? (
        <p className="schedule-intro">Chargement…</p>
      ) : charges.length === 0 ? (
        <p className="schedule-intro">Rien à payer pour l'instant.</p>
      ) : (
        <div className="devoirs-list">
          {charges.map((c) => (
            <article className="devoir" key={c.id}>
              <div className="devoir__meta">
                <span className="devoir__eleve">{c.company?.holder_name || "?"}</span>
                {c.requested_at ? <span className="devoir__date">{formatDate(c.requested_at)}</span> : null}
              </div>
              <h4 className="devoir__titre">{c.reason || "Sans motif"}</h4>
              <p className="espace-charge__montant">{formatMontant(c.amount)}</p>
              <div className="espace-charge__actions">
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  disabled={busyId === c.id}
                  onClick={() => respond(c.id, true)}
                >
                  {busyId === c.id ? "…" : "Payer"}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger"
                  disabled={busyId === c.id}
                  onClick={() => respond(c.id, false)}
                >
                  Refuser
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
