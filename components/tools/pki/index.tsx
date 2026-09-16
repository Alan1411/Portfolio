"use client";

import { useState } from "react";
import { CopyButton } from "../CopyButton";
import { decodeCertificate, type CertificateInfo } from "@/lib/tools/cert";

export function SslCertDecoder() {
  const [pem, setPem] = useState("");
  const [info, setInfo] = useState<CertificateInfo | null>(null);
  const [error, setError] = useState("");

  async function decode() {
    setError("");
    setInfo(null);
    try {
      setInfo(await decodeCertificate(pem));
    } catch (e: any) {
      setError(e.message || "Zertifikat konnte nicht gelesen werden");
    }
  }

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>PEM-Zertifikat</span>
        <textarea rows={8} value={pem} onChange={(e) => setPem(e.target.value)} placeholder={"-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"} />
      </label>
      <button type="button" className="btn btn-primary" onClick={decode} disabled={!pem}>Zertifikat lesen</button>
      {error && <p className="tool-error">{error}</p>}
      {info && (
        <div className="tool-result-list">
          <div className="tool-result-row"><span className="tool-result-label">Subject</span><code className="tool-result-value">{info.subject}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Issuer</span><code className="tool-result-value">{info.issuer}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Gültig ab</span><code className="tool-result-value">{info.notBefore.toLocaleString("de-DE")}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Gültig bis</span><code className="tool-result-value">{info.notAfter.toLocaleString("de-DE")}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Seriennummer</span><code className="tool-result-value">{info.serialNumber}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Signatur-Algorithmus</span><code className="tool-result-value">{info.signatureAlgorithm}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Public-Key-Algorithmus</span><code className="tool-result-value">{info.publicKeyAlgorithm}</code></div>
          {info.subjectAltNames.length > 0 && (
            <div className="tool-result-row"><span className="tool-result-label">Subject Alt Names</span><code className="tool-result-value">{info.subjectAltNames.join(", ")}</code></div>
          )}
          <div className="tool-result-row"><span className="tool-result-label">SHA-256 Fingerprint</span><code className="tool-result-value">{info.fingerprintSha256}</code><CopyButton text={info.fingerprintSha256} /></div>
          <div className="tool-result-row">
            <span className="tool-result-label">Status</span>
            <span className={info.isExpired ? "tool-error" : "tool-check-pass"}>
              {info.isExpired ? `Abgelaufen (seit ${Math.abs(info.daysUntilExpiry)} Tagen)` : `Gültig (noch ${info.daysUntilExpiry} Tage)`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export function CertExpiryCalculator() {
  const [mode, setMode] = useState<"date" | "pem">("date");
  const [dateInput, setDateInput] = useState("");
  const [pem, setPem] = useState("");
  const [pemResult, setPemResult] = useState<CertificateInfo | null>(null);
  const [error, setError] = useState("");

  async function decodeFromPem() {
    setError("");
    try {
      setPemResult(await decodeCertificate(pem));
    } catch (e: any) {
      setError(e.message);
    }
  }

  const manualDate = dateInput ? new Date(dateInput) : null;
  const manualDays = manualDate ? Math.floor((manualDate.getTime() - Date.now()) / 86400000) : null;

  return (
    <div className="tool-panel">
      <div className="tool-tabs">
        <button type="button" className={mode === "date" ? "active" : ""} onClick={() => setMode("date")}>Datum eingeben</button>
        <button type="button" className={mode === "pem" ? "active" : ""} onClick={() => setMode("pem")}>Aus PEM lesen</button>
      </div>

      {mode === "date" ? (
        <>
          <label className="tool-field">
            <span>Ablaufdatum</span>
            <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
          </label>
          {manualDays !== null && (
            <p className={manualDays < 0 ? "tool-error" : manualDays < 30 ? "tool-log-warning" : "tool-check-pass"}>
              {manualDays < 0 ? `Abgelaufen seit ${Math.abs(manualDays)} Tagen` : `Läuft in ${manualDays} Tagen ab`}
            </p>
          )}
        </>
      ) : (
        <>
          <label className="tool-field">
            <span>PEM-Zertifikat</span>
            <textarea rows={6} value={pem} onChange={(e) => setPem(e.target.value)} />
          </label>
          <button type="button" className="btn btn-primary" onClick={decodeFromPem} disabled={!pem}>Ablaufdatum ermitteln</button>
          {error && <p className="tool-error">{error}</p>}
          {pemResult && (
            <p className={pemResult.isExpired ? "tool-error" : pemResult.daysUntilExpiry < 30 ? "tool-log-warning" : "tool-check-pass"}>
              {pemResult.isExpired
                ? `Abgelaufen seit ${Math.abs(pemResult.daysUntilExpiry)} Tagen (${pemResult.notAfter.toLocaleDateString("de-DE")})`
                : `Läuft in ${pemResult.daysUntilExpiry} Tagen ab (${pemResult.notAfter.toLocaleDateString("de-DE")})`}
            </p>
          )}
        </>
      )}
    </div>
  );
}

const CSR_STEPS = [
  {
    title: "1. Privaten Schlüssel erzeugen",
    text: "Erzeugt einen 2048-Bit RSA-Schlüssel. Dieser Schlüssel bleibt geheim und wird niemals weitergegeben.",
    command: "openssl genrsa -out privatkey.key 2048",
  },
  {
    title: "2. CSR (Certificate Signing Request) erstellen",
    text: "Interaktive Abfrage von Organisation, Land, Common Name (Domain) usw.",
    command: "openssl req -new -key privatkey.key -out anfrage.csr",
  },
  {
    title: "3. CSR-Inhalt prüfen",
    text: "Zeigt die im CSR enthaltenen Angaben zur Kontrolle vor der Einreichung an.",
    command: "openssl req -text -noout -verify -in anfrage.csr",
  },
  {
    title: "4. CSR bei der Zertifizierungsstelle (CA) einreichen",
    text: "Den Inhalt der Datei anfrage.csr (inkl. BEGIN/END-Zeilen) bei der CA (z.B. Let's Encrypt, internes PKI) einreichen.",
    command: "cat anfrage.csr",
  },
  {
    title: "5. Signiertes Zertifikat installieren",
    text: "Nach Erhalt das signierte Zertifikat zusammen mit dem privaten Schlüssel auf dem Server installieren.",
    command: "openssl x509 -in zertifikat.crt -text -noout",
  },
];

export function CsrGuide() {
  return (
    <div className="tool-panel">
      <p className="muted" style={{ textAlign: "left" }}>
        Schritt-für-Schritt-Anleitung zur Erstellung eines Certificate Signing Requests (CSR) mit OpenSSL.
      </p>
      <div className="tool-csr-steps">
        {CSR_STEPS.map((step) => (
          <div key={step.title} className="tool-csr-step">
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <div className="tool-result-row">
              <code className="tool-result-value">{step.command}</code>
              <CopyButton text={step.command} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
