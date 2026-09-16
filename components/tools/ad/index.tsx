"use client";

import { useState } from "react";
import { CopyButton } from "../CopyButton";
import { generateUsernames, decodeSid, decodeGuid, generateGuid } from "@/lib/tools/ad";

export function UsernameGenerator() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const usernames = firstName && lastName ? generateUsernames(firstName, lastName) : [];

  return (
    <div className="tool-panel">
      <div className="tool-row">
        <label className="tool-field"><span>Vorname</span><input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></label>
        <label className="tool-field"><span>Nachname</span><input value={lastName} onChange={(e) => setLastName(e.target.value)} /></label>
      </div>
      {usernames.length > 0 && (
        <div className="tool-result-list">
          {usernames.map((u) => (
            <div key={u.format} className="tool-result-row">
              <span className="tool-result-label">{u.format}</span>
              <code className="tool-result-value">{u.value}</code>
              <CopyButton text={u.value} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SidGuidDecoder() {
  const [mode, setMode] = useState<"sid" | "guid">("sid");
  const [input, setInput] = useState("");
  let error = "";

  let sid = null;
  let guid = null;
  try {
    if (mode === "sid" && input) sid = decodeSid(input);
    if (mode === "guid" && input) guid = decodeGuid(input);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="tool-panel">
      <div className="tool-tabs">
        <button type="button" className={mode === "sid" ? "active" : ""} onClick={() => setMode("sid")}>SID</button>
        <button type="button" className={mode === "guid" ? "active" : ""} onClick={() => setMode("guid")}>GUID/UUID</button>
      </div>
      <label className="tool-field">
        <span>{mode === "sid" ? "SID" : "GUID"}</span>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "sid" ? "S-1-5-21-1111111111-2222222222-3333333333-500" : "550e8400-e29b-41d4-a716-446655440000"} />
      </label>
      {mode === "guid" && (
        <button type="button" className="btn btn-secondary btn-small" onClick={() => setInput(generateGuid())}>Zufällige GUID erzeugen</button>
      )}
      {error && <p className="tool-error">{error}</p>}
      {sid && (
        <div className="tool-result-list">
          <div className="tool-result-row"><span className="tool-result-label">Revision</span><code className="tool-result-value">{sid.revision}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Identifier Authority</span><code className="tool-result-value">{sid.identifierAuthority}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Sub-Authorities</span><code className="tool-result-value">{sid.subAuthorities.join(" - ") || "–"}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">RID</span><code className="tool-result-value">{sid.rid}{sid.wellKnown ? ` (${sid.wellKnown})` : ""}</code></div>
        </div>
      )}
      {guid && (
        <div className="tool-result-list">
          <div className="tool-result-row"><span className="tool-result-label">time_low</span><code className="tool-result-value">{guid.timeLow}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">time_mid</span><code className="tool-result-value">{guid.timeMid}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">time_hi_and_version</span><code className="tool-result-value">{guid.timeHiAndVersion}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">clock_seq</span><code className="tool-result-value">{guid.clockSeq}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">node</span><code className="tool-result-value">{guid.node}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Version</span><code className="tool-result-value">{guid.version}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Variante</span><code className="tool-result-value">{guid.variant}</code></div>
        </div>
      )}
    </div>
  );
}
