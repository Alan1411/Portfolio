"use client";

import { useState } from "react";
import { CopyButton } from "../CopyButton";
import {
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  htmlEntitiesEncode,
  htmlEntitiesDecode,
  textToBinary,
  binaryToText,
  textToHex,
  hexToText,
  textToMorse,
  morseToText,
  convertNumberBase,
  type NumberBase,
} from "@/lib/tools/encoding";

function EncodeDecodePanel({
  encodeLabel,
  decodeLabel,
  encode,
  decode,
}: {
  encodeLabel: string;
  decodeLabel: string;
  encode: (s: string) => string;
  decode: (s: string) => string;
}) {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");

  let output = "";
  let error = "";
  try {
    output = input ? (mode === "encode" ? encode(input) : decode(input)) : "";
  } catch (e: any) {
    error = e.message || "Ungültige Eingabe";
  }

  return (
    <div className="tool-panel">
      <div className="tool-tabs">
        <button type="button" className={mode === "encode" ? "active" : ""} onClick={() => setMode("encode")}>{encodeLabel}</button>
        <button type="button" className={mode === "decode" ? "active" : ""} onClick={() => setMode("decode")}>{decodeLabel}</button>
      </div>
      <label className="tool-field">
        <span>Eingabe</span>
        <textarea rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
      </label>
      {error && <p className="tool-error">{error}</p>}
      {output && (
        <div className="tool-result-row">
          <code className="tool-result-value">{output}</code>
          <CopyButton text={output} />
        </div>
      )}
    </div>
  );
}

export function Base64Tool() {
  return <EncodeDecodePanel encodeLabel="Kodieren" decodeLabel="Dekodieren" encode={base64Encode} decode={base64Decode} />;
}
export function UrlEncodingTool() {
  return <EncodeDecodePanel encodeLabel="Kodieren" decodeLabel="Dekodieren" encode={urlEncode} decode={urlDecode} />;
}
export function HtmlEntitiesTool() {
  return <EncodeDecodePanel encodeLabel="Kodieren" decodeLabel="Dekodieren" encode={htmlEntitiesEncode} decode={htmlEntitiesDecode} />;
}
export function BinaryTextTool() {
  return <EncodeDecodePanel encodeLabel="Text → Binär" decodeLabel="Binär → Text" encode={textToBinary} decode={binaryToText} />;
}
export function HexTextTool() {
  return <EncodeDecodePanel encodeLabel="Text → Hex" decodeLabel="Hex → Text" encode={textToHex} decode={hexToText} />;
}
export function MorseCodeTool() {
  return <EncodeDecodePanel encodeLabel="Text → Morse" decodeLabel="Morse → Text" encode={textToMorse} decode={morseToText} />;
}

export function NumberBaseConverter() {
  const [value, setValue] = useState("42");
  const [from, setFrom] = useState<NumberBase>("dec");

  let result: Record<NumberBase, string> | null = null;
  let error = "";
  try {
    result = value ? convertNumberBase(value, from) : null;
  } catch (e: any) {
    error = e.message;
  }

  const labels: Record<NumberBase, string> = { dec: "Dezimal", bin: "Binär", hex: "Hexadezimal", oct: "Oktal" };

  return (
    <div className="tool-panel">
      <div className="tool-row">
        <label className="tool-field" style={{ flex: 1 }}>
          <span>Wert</span>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <label className="tool-field">
          <span>Eingabe-Basis</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as NumberBase)}>
            {Object.entries(labels).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </select>
        </label>
      </div>
      {error && <p className="tool-error">{error}</p>}
      {result && (
        <div className="tool-result-list">
          {(Object.keys(labels) as NumberBase[]).map((base) => (
            <div key={base} className="tool-result-row">
              <span className="tool-result-label">{labels[base]}</span>
              <code className="tool-result-value">{result![base]}</code>
              <CopyButton text={result![base]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AsciiTable() {
  const [search, setSearch] = useState("");
  const entries = Array.from({ length: 128 }, (_, i) => i).filter((code) => {
    if (!search) return true;
    const char = String.fromCharCode(code);
    return String(code).includes(search) || char.toLowerCase() === search.toLowerCase() || code.toString(16).toLowerCase() === search.toLowerCase();
  });

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Suche (Zeichen, Dezimal oder Hex)</span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="z.B. A oder 65 oder 41" />
      </label>
      <div className="tool-ascii-grid">
        {entries.map((code) => (
          <div key={code} className="tool-ascii-cell">
            <span className="tool-ascii-char">{code < 32 || code === 127 ? "·" : String.fromCharCode(code)}</span>
            <span className="tool-ascii-meta">Dez {code} · Hex {code.toString(16).toUpperCase().padStart(2, "0")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
