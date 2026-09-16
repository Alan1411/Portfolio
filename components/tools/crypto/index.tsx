"use client";

import { useState } from "react";
import { CopyButton } from "../CopyButton";
import {
  generateAllHashes,
  identifyHash,
  generateHMAC,
  caesarCipher,
  rot13,
  vigenere,
  aesEncrypt,
  aesDecrypt,
} from "@/lib/tools/crypto";

export function HashGenerator() {
  const [input, setInput] = useState("");
  const hashes = input ? generateAllHashes(input) : null;

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Text</span>
        <textarea rows={4} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Text eingeben…" />
      </label>
      {hashes && (
        <div className="tool-result-list">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="tool-result-row">
              <span className="tool-result-label">{algo}</span>
              <code className="tool-result-value">{hash}</code>
              <CopyButton text={hash} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function HashIdentifier() {
  const [input, setInput] = useState("");
  const guesses = input ? identifyHash(input) : [];

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Hash</span>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="z.B. 5d41402abc4b2a76b9719d911017c592" />
      </label>
      {guesses.length > 0 && (
        <ul className="tool-list">
          {guesses.map((g, i) => (
            <li key={i}>
              <strong>{g.name}</strong> — Wahrscheinlichkeit: {g.confidence}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function HmacGenerator() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [algo, setAlgo] = useState<"SHA1" | "SHA256" | "SHA512">("SHA256");
  const result = message && secret ? generateHMAC(message, secret, algo) : "";

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Nachricht</span>
        <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <label className="tool-field">
        <span>Geheimer Schlüssel</span>
        <input value={secret} onChange={(e) => setSecret(e.target.value)} />
      </label>
      <label className="tool-field">
        <span>Algorithmus</span>
        <select value={algo} onChange={(e) => setAlgo(e.target.value as any)}>
          <option value="SHA1">HMAC-SHA1</option>
          <option value="SHA256">HMAC-SHA256</option>
          <option value="SHA512">HMAC-SHA512</option>
        </select>
      </label>
      {result && (
        <div className="tool-result-row">
          <code className="tool-result-value">{result}</code>
          <CopyButton text={result} />
        </div>
      )}
    </div>
  );
}

export function CaesarCipher() {
  const [text, setText] = useState("");
  const [shift, setShift] = useState(3);
  const result = caesarCipher(text, shift);

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Text</span>
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label className="tool-field">
        <span>Verschiebung ({shift})</span>
        <input type="range" min={-25} max={25} value={shift} onChange={(e) => setShift(Number(e.target.value))} />
      </label>
      <div className="tool-result-row">
        <code className="tool-result-value">{result}</code>
        <CopyButton text={result} />
      </div>
    </div>
  );
}

export function Rot13Tool() {
  const [text, setText] = useState("");
  const result = rot13(text);

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Text</span>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <div className="tool-result-row">
        <code className="tool-result-value">{result}</code>
        <CopyButton text={result} />
      </div>
      <p className="muted" style={{ textAlign: "left" }}>ROT13 ist selbstinvers – zum Entschlüsseln einfach das Ergebnis erneut eingeben.</p>
    </div>
  );
}

export function VigenereCipher() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [decrypt, setDecrypt] = useState(false);
  const result = key ? vigenere(text, key, decrypt) : "";

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Text</span>
        <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label className="tool-field">
        <span>Schlüsselwort</span>
        <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="z.B. GEHEIM" />
      </label>
      <label className="tool-checkbox">
        <input type="checkbox" checked={decrypt} onChange={(e) => setDecrypt(e.target.checked)} />
        <span>Entschlüsseln (statt verschlüsseln)</span>
      </label>
      {result && (
        <div className="tool-result-row">
          <code className="tool-result-value">{result}</code>
          <CopyButton text={result} />
        </div>
      )}
    </div>
  );
}

export function AesEncryption() {
  const [text, setText] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function run() {
    setError("");
    try {
      setResult(mode === "encrypt" ? aesEncrypt(text, passphrase) : aesDecrypt(text, passphrase));
    } catch (e: any) {
      setResult("");
      setError(e.message);
    }
  }

  return (
    <div className="tool-panel">
      <div className="tool-tabs">
        <button type="button" className={mode === "encrypt" ? "active" : ""} onClick={() => setMode("encrypt")}>Verschlüsseln</button>
        <button type="button" className={mode === "decrypt" ? "active" : ""} onClick={() => setMode("decrypt")}>Entschlüsseln</button>
      </div>
      <label className="tool-field">
        <span>{mode === "encrypt" ? "Klartext" : "Ciphertext"}</span>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <label className="tool-field">
        <span>Passphrase</span>
        <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} />
      </label>
      <button type="button" className="btn btn-primary" onClick={run}>{mode === "encrypt" ? "Verschlüsseln" : "Entschlüsseln"}</button>
      {error && <p className="tool-error">{error}</p>}
      {result && (
        <div className="tool-result-row">
          <code className="tool-result-value">{result}</code>
          <CopyButton text={result} />
        </div>
      )}
    </div>
  );
}
