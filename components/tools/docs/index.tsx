"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "../CopyButton";

export function ItTicketTemplate() {
  const [title, setTitle] = useState("");
  const [requester, setRequester] = useState("");
  const [priority, setPriority] = useState("Mittel");
  const [category, setCategory] = useState("Hardware");
  const [description, setDescription] = useState("");

  const template = `Titel: ${title || "-"}
Melder: ${requester || "-"}
Priorität: ${priority}
Kategorie: ${category}
Erstellt am: ${new Date().toLocaleDateString("de-DE")}

Beschreibung:
${description || "-"}

Bisherige Schritte:
-

Betroffene Systeme:
-`;

  return (
    <div className="tool-panel">
      <div className="tool-row">
        <label className="tool-field"><span>Titel</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <label className="tool-field"><span>Melder</span><input value={requester} onChange={(e) => setRequester(e.target.value)} /></label>
      </div>
      <div className="tool-row">
        <label className="tool-field">
          <span>Priorität</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {["Niedrig", "Mittel", "Hoch", "Kritisch"].map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <label className="tool-field">
          <span>Kategorie</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {["Hardware", "Software", "Netzwerk", "Zugriff/Berechtigung", "E-Mail", "Sonstiges"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <label className="tool-field"><span>Beschreibung</span><textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} /></label>
      <div className="tool-row" style={{ justifyContent: "flex-end" }}><CopyButton text={template} /></div>
      <pre className="tool-output-area">{template}</pre>
    </div>
  );
}

export function OnboardingChecklist() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");

  const items = [
    "AD-Benutzerkonto anlegen",
    "E-Mail-Postfach einrichten",
    "Gruppenmitgliedschaften zuweisen",
    "Hardware bereitstellen (Laptop, Zubehör)",
    "Software-Lizenzen zuweisen",
    "VPN-/Remote-Zugang einrichten",
    "Zugang zu Teamverzeichnissen/Freigaben",
    "Zutrittskarte / Schlüssel ausgeben",
    "Begrüßungs-Mail versenden",
    "Ersttag-Einweisung planen",
  ];

  const checklist = `Onboarding-Checkliste
Name: ${name || "-"}
Rolle: ${role || "-"}
Starttermin: ${startDate || "-"}

${items.map((i) => `[ ] ${i}`).join("\n")}`;

  return (
    <div className="tool-panel">
      <div className="tool-row">
        <label className="tool-field"><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className="tool-field"><span>Rolle</span><input value={role} onChange={(e) => setRole(e.target.value)} /></label>
        <label className="tool-field"><span>Starttermin</span><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
      </div>
      <div className="tool-row" style={{ justifyContent: "flex-end" }}><CopyButton text={checklist} /></div>
      <pre className="tool-output-area">{checklist}</pre>
    </div>
  );
}

export function PasswordHandoverTemplate() {
  const [system, setSystem] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recipient, setRecipient] = useState("");

  const template = `═══════════════════════════════════
  ZUGANGSDATEN-ÜBERGABE (vertraulich)
═══════════════════════════════════

System/Dienst:  ${system || "-"}
Benutzername:   ${username || "-"}
Passwort:       ${password || "-"}

Übergeben an:   ${recipient || "-"}
Datum:          ${new Date().toLocaleDateString("de-DE")}

Hinweis: Bitte das Passwort nach der ersten Anmeldung ändern.
Dieses Dokument nach der Übergabe vernichten.
═══════════════════════════════════`;

  return (
    <div className="tool-panel">
      <p className="muted" style={{ textAlign: "left" }}>Zum Ausdrucken für die persönliche/postalische Übergabe – nicht per E-Mail versenden.</p>
      <div className="tool-row">
        <label className="tool-field"><span>System/Dienst</span><input value={system} onChange={(e) => setSystem(e.target.value)} /></label>
        <label className="tool-field"><span>Empfänger</span><input value={recipient} onChange={(e) => setRecipient(e.target.value)} /></label>
      </div>
      <div className="tool-row">
        <label className="tool-field"><span>Benutzername</span><input value={username} onChange={(e) => setUsername(e.target.value)} /></label>
        <label className="tool-field"><span>Passwort</span><input value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      </div>
      <div className="tool-row" style={{ justifyContent: "flex-end" }}>
        <CopyButton text={template} />
        <button type="button" className="btn btn-secondary btn-small" onClick={() => window.print()}>Drucken</button>
      </div>
      <pre className="tool-output-area tool-print-area">{template}</pre>
    </div>
  );
}

interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  tags: string[];
  created_at: string;
}

export function SnippetCollection() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("bash");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/snippets");
      const data = await res.json();
      setSnippets(Array.isArray(data) ? data : []);
    } catch {
      setSnippets([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setLanguage("bash");
    setCode("");
    setTags("");
  }

  async function save() {
    if (!title || !code) return;
    const payload = { title, language, code, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) };
    if (editingId) {
      await fetch(`/api/tools/snippets/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch("/api/tools/snippets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    }
    resetForm();
    load();
  }

  function edit(s: Snippet) {
    setEditingId(s.id);
    setTitle(s.title);
    setLanguage(s.language);
    setCode(s.code);
    setTags((s.tags || []).join(", "));
  }

  async function remove(id: string) {
    await fetch(`/api/tools/snippets/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="tool-panel">
      <div className="admin-form">
        <label><span>Titel</span><input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
        <div className="tool-row">
          <label className="tool-field">
            <span>Sprache</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="bash">Bash</option>
              <option value="powershell">PowerShell</option>
            </select>
          </label>
          <label className="tool-field" style={{ flex: 1 }}><span>Tags (Komma-getrennt)</span><input value={tags} onChange={(e) => setTags(e.target.value)} /></label>
        </div>
        <label><span>Code</span><textarea rows={6} value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} /></label>
        <div className="tool-row">
          <button type="button" className="btn btn-primary" onClick={save} disabled={!title || !code}>{editingId ? "Speichern" : "Snippet hinzufügen"}</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={resetForm}>Abbrechen</button>}
        </div>
      </div>

      {loading ? (
        <p className="muted">Lade Snippets…</p>
      ) : snippets.length === 0 ? (
        <p className="muted">Noch keine Snippets gespeichert.</p>
      ) : (
        <div className="tool-snippet-list">
          {snippets.map((s) => (
            <div key={s.id} className="tool-snippet-card">
              <div className="tool-row" style={{ justifyContent: "space-between" }}>
                <strong>{s.title}</strong>
                <span className="tech-tag">{s.language}</span>
              </div>
              <pre className="tool-output-area">{s.code}</pre>
              {s.tags?.length > 0 && (
                <div className="tech-tags">{s.tags.map((t) => <span key={t} className="tech-tag">{t}</span>)}</div>
              )}
              <div className="tool-row">
                <CopyButton text={s.code} />
                <button type="button" className="btn btn-secondary btn-small" onClick={() => edit(s)}>Bearbeiten</button>
                <button type="button" className="btn btn-danger btn-small" onClick={() => remove(s.id)}>Löschen</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
