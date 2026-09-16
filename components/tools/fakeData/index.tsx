"use client";

import { useState } from "react";
import { CopyButton } from "../CopyButton";
import {
  generateFullPerson,
  flattenPerson,
  exportAsCsv,
  exportAsJson,
  exportAsSql,
  type FullPerson,
} from "@/lib/tools/fakeData";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="tool-result-row">
      <span className="tool-result-label">{label}</span>
      <code className="tool-result-value">{value}</code>
      <CopyButton text={value} />
    </div>
  );
}

export function FakeDataGenerator() {
  const [person, setPerson] = useState<FullPerson | null>(null);
  const [bulkCount, setBulkCount] = useState<1 | 10 | 50 | 100>(10);
  const [bulkFormat, setBulkFormat] = useState<"csv" | "json" | "sql">("csv");
  const [bulkOutput, setBulkOutput] = useState("");

  function regenerate() {
    setPerson(generateFullPerson());
  }

  function generateBulk() {
    const rows = Array.from({ length: bulkCount }, () => flattenPerson(generateFullPerson()));
    const output = bulkFormat === "csv" ? exportAsCsv(rows) : bulkFormat === "json" ? exportAsJson(rows) : exportAsSql(rows);
    setBulkOutput(output);
  }

  function downloadBulk() {
    if (!bulkOutput) return;
    const mime = bulkFormat === "csv" ? "text/csv" : bulkFormat === "json" ? "application/json" : "text/plain";
    const blob = new Blob([bulkOutput], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `testdaten.${bulkFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="tool-panel">
      <p className="muted" style={{ textAlign: "left" }}>
        Rein clientseitig generierte, frei erfundene Testdaten (Namen, Adressen, IBAN, Kreditkarten etc.
        sind plausibel formatiert, aber nicht real).
      </p>

      <section className="tool-fakedata-section">
        <div className="tool-row" style={{ justifyContent: "space-between" }}>
          <h3>Einzelne Person</h3>
          <button type="button" className="btn btn-primary" onClick={regenerate}>🎲 Komplette Person generieren</button>
        </div>

        {person && (
          <>
            <h4>Person</h4>
            <div className="tool-result-list">
              <Row label="Vorname" value={person.person.firstName} />
              <Row label="Nachname" value={person.person.lastName} />
              <Row label="Geschlecht" value={person.person.gender} />
              <Row label="Geburtsdatum" value={person.person.birthDate} />
            </div>

            <h4>Adresse</h4>
            <div className="tool-result-list">
              <Row label="Straße" value={`${person.address.street} ${person.address.houseNumber}`} />
              <Row label="PLZ / Stadt" value={`${person.address.plz} ${person.address.city}`} />
              <Row label="Bundesland" value={person.address.state} />
            </div>

            <h4>Kontakt</h4>
            <div className="tool-result-list">
              <Row label="Telefon" value={person.contact.phone} />
              <Row label="Mobil" value={person.contact.mobile} />
              <Row label="E-Mail" value={person.contact.email} />
            </div>

            <h4>Login-Daten</h4>
            <div className="tool-result-list">
              {person.login.usernames.slice(0, 3).map((u) => (
                <Row key={u.format} label={`Username (${u.format})`} value={u.value} />
              ))}
              <Row label="Passwort" value={person.login.password} />
              <Row label="PIN" value={person.login.pin} />
            </div>

            <h4>Firma</h4>
            <div className="tool-result-list">
              <Row label="Firma" value={person.company.name} />
              <Row label="Abteilung" value={person.company.department} />
              <Row label="Position" value={person.company.position} />
              <Row label="Firmen-E-Mail" value={person.company.companyEmail} />
              <Row label="USt-ID" value={person.company.vatId} />
            </div>

            <h4>Finanzen</h4>
            <div className="tool-result-list">
              <Row label="IBAN" value={person.finance.iban} />
              <Row label="BIC" value={person.finance.bic} />
              <Row label="Bank" value={person.finance.bankName} />
              <Row label="Kreditkarte" value={person.finance.creditCardNumber} />
            </div>

            <h4>IT-Daten</h4>
            <div className="tool-result-list">
              <Row label="IP-Adresse" value={person.it.ip} />
              <Row label="MAC-Adresse" value={person.it.mac} />
              <Row label="Hostname" value={person.it.hostname} />
              <Row label="Computername" value={person.it.computerName} />
              <Row label="UUID" value={person.it.uuid} />
            </div>
          </>
        )}
      </section>

      <section className="tool-fakedata-section">
        <h3>Massenexport</h3>
        <div className="tool-row">
          <label className="tool-field">
            <span>Anzahl</span>
            <select value={bulkCount} onChange={(e) => setBulkCount(Number(e.target.value) as any)}>
              {[1, 10, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label className="tool-field">
            <span>Format</span>
            <select value={bulkFormat} onChange={(e) => setBulkFormat(e.target.value as any)}>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="sql">SQL</option>
            </select>
          </label>
        </div>
        <div className="tool-row">
          <button type="button" className="btn btn-primary" onClick={generateBulk}>Generieren</button>
          {bulkOutput && <button type="button" className="btn btn-secondary" onClick={downloadBulk}>Herunterladen</button>}
        </div>
        {bulkOutput && (
          <>
            <div className="tool-row" style={{ justifyContent: "flex-end" }}><CopyButton text={bulkOutput} /></div>
            <textarea readOnly rows={12} value={bulkOutput} className="tool-output-area" />
          </>
        )}
      </section>
    </div>
  );
}
