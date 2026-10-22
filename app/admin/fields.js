"use client";

export function Field({ label, value, onChange, textarea, mono }) {
  return (
    <label className="admin-field">
      <span className="admin-field__label">{label}</span>
      {textarea ? (
        <textarea
          className="admin-field__input admin-field__input--textarea"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          style={mono ? { fontFamily: "var(--font-mono)" } : undefined}
        />
      ) : (
        <input
          className="admin-field__input"
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
