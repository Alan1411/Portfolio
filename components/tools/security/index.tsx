"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "../CopyButton";
import {
  generatePassword,
  checkPasswordStrength,
  checkPwnedPassword,
  checkAdPasswordPolicy,
  type PasswordOptions,
} from "@/lib/tools/password";

export function PasswordGenerator() {
  const [opts, setOpts] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function regenerate(o = opts) {
    try {
      setPassword(generatePassword(o));
      setError("");
    } catch (e: any) {
      setPassword("");
      setError(e.message);
    }
  }

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(patch: Partial<PasswordOptions>) {
    const next = { ...opts, ...patch };
    setOpts(next);
    regenerate(next);
  }

  return (
    <div className="tool-panel">
      <div className="tool-result-row tool-password-display">
        <code className="tool-result-value">{password || "—"}</code>
        <CopyButton text={password} />
        <button type="button" className="btn btn-secondary btn-small" onClick={() => regenerate()}>🔄 Neu</button>
      </div>
      {error && <p className="tool-error">{error}</p>}

      <label className="tool-field">
        <span>Länge ({opts.length})</span>
        <input type="range" min={4} max={64} value={opts.length} onChange={(e) => update({ length: Number(e.target.value) })} />
      </label>
      <label className="tool-checkbox">
        <input type="checkbox" checked={opts.uppercase} onChange={(e) => update({ uppercase: e.target.checked })} />
        <span>Großbuchstaben (A-Z)</span>
      </label>
      <label className="tool-checkbox">
        <input type="checkbox" checked={opts.lowercase} onChange={(e) => update({ lowercase: e.target.checked })} />
        <span>Kleinbuchstaben (a-z)</span>
      </label>
      <label className="tool-checkbox">
        <input type="checkbox" checked={opts.numbers} onChange={(e) => update({ numbers: e.target.checked })} />
        <span>Zahlen (0-9)</span>
      </label>
      <label className="tool-checkbox">
        <input type="checkbox" checked={opts.symbols} onChange={(e) => update({ symbols: e.target.checked })} />
        <span>Sonderzeichen (!@#...)</span>
      </label>
      <label className="tool-checkbox">
        <input type="checkbox" checked={opts.excludeAmbiguous} onChange={(e) => update({ excludeAmbiguous: e.target.checked })} />
        <span>Verwechselbare Zeichen ausschließen (I, l, 1, O, 0)</span>
      </label>
    </div>
  );
}

export function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const result = checkPasswordStrength(password);
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Passwort</span>
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort eingeben…" />
      </label>
      <div className="tool-strength-bar">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="tool-strength-segment" style={{ background: i <= result.score ? colors[result.score] : "var(--border)" }} />
        ))}
      </div>
      <p><strong>{result.label}</strong> · geschätzte Entropie: {result.entropyBits} Bit</p>
      <ul className="tool-list">
        {result.checks.map((c, i) => (
          <li key={i} className={c.passed ? "tool-check-pass" : "tool-check-fail"}>
            {c.passed ? "✓" : "✗"} {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HibpChecker() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState(0);

  async function check() {
    if (!password) return;
    setStatus("loading");
    try {
      const c = await checkPwnedPassword(password);
      setCount(c);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="tool-panel">
      <p className="muted" style={{ textAlign: "left" }}>
        Prüft per k-Anonymität gegen die Pwned-Passwords-API: Es werden nur die ersten 5 Zeichen des
        SHA-1-Hashes übertragen, das vollständige Passwort verlässt nie den Browser.
      </p>
      <label className="tool-field">
        <span>Passwort</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="button" className="btn btn-primary" onClick={check} disabled={!password || status === "loading"}>
        {status === "loading" ? "Prüfe…" : "Prüfen"}
      </button>
      {status === "error" && <p className="tool-error">API nicht erreichbar. Bitte später erneut versuchen.</p>}
      {status === "done" && (
        count > 0 ? (
          <p className="tool-error">⚠️ Dieses Passwort wurde bereits {count.toLocaleString("de-DE")}x in bekannten Datenlecks gefunden. Nicht verwenden!</p>
        ) : (
          <p className="tool-check-pass">✓ Passwort wurde in keinem bekannten Leak gefunden.</p>
        )
      )}
    </div>
  );
}

export function PasswordPolicyChecker() {
  const [password, setPassword] = useState("");
  const [minLength, setMinLength] = useState(8);
  const results = checkAdPasswordPolicy(password, minLength);
  const allPassed = results.every((r) => r.passed);

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Passwort</span>
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label className="tool-field">
        <span>Mindestlänge (Richtlinie)</span>
        <input type="number" min={4} max={64} value={minLength} onChange={(e) => setMinLength(Number(e.target.value))} />
      </label>
      <ul className="tool-list">
        {results.map((r, i) => (
          <li key={i} className={r.passed ? "tool-check-pass" : "tool-check-fail"}>
            {r.passed ? "✓" : "✗"} {r.rule}
          </li>
        ))}
      </ul>
      {password && (
        <p>{allPassed ? "✓ Entspricht der typischen AD-Komplexitätsrichtlinie." : "✗ Erfüllt die Richtlinie noch nicht."}</p>
      )}
    </div>
  );
}
