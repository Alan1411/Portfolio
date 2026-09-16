"use client";

import { useState } from "react";
import { CopyButton } from "../CopyButton";
import { formatJson, minifyJson, formatXml, formatYaml, yamlToJson } from "@/lib/tools/textFormat";
import { diffLines } from "@/lib/tools/diff";

export function JsonFormatter() {
  const [input, setInput] = useState('{\n  "hello": "world"\n}');
  let output = "";
  let error = "";
  try {
    output = input ? formatJson(input) : "";
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>JSON</span>
        <textarea rows={10} value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </label>
      {error && <p className="tool-error">Ungültiges JSON: {error}</p>}
      {output && (
        <>
          <div className="tool-row" style={{ justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-secondary btn-small" onClick={() => setInput(minifyJson(input))}>Minifizieren</button>
            <CopyButton text={output} />
          </div>
          <pre className="tool-output-area">{output}</pre>
        </>
      )}
    </div>
  );
}

export function XmlFormatter() {
  const [input, setInput] = useState("<root><item>Wert</item></root>");
  let output = "";
  let error = "";
  try {
    output = input ? formatXml(input) : "";
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>XML</span>
        <textarea rows={10} value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </label>
      {error && <p className="tool-error">Ungültiges XML: {error}</p>}
      {output && (
        <>
          <div className="tool-row" style={{ justifyContent: "flex-end" }}><CopyButton text={output} /></div>
          <pre className="tool-output-area">{output}</pre>
        </>
      )}
    </div>
  );
}

export function YamlFormatter() {
  const [input, setInput] = useState("hello: world\nliste:\n  - eins\n  - zwei");
  const [asJson, setAsJson] = useState(false);
  let output = "";
  let error = "";
  try {
    output = input ? (asJson ? yamlToJson(input) : formatYaml(input)) : "";
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>YAML</span>
        <textarea rows={10} value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} />
      </label>
      <label className="tool-checkbox">
        <input type="checkbox" checked={asJson} onChange={(e) => setAsJson(e.target.checked)} />
        <span>Als JSON ausgeben</span>
      </label>
      {error && <p className="tool-error">Ungültiges YAML: {error}</p>}
      {output && (
        <>
          <div className="tool-row" style={{ justifyContent: "flex-end" }}><CopyButton text={output} /></div>
          <pre className="tool-output-area">{output}</pre>
        </>
      )}
    </div>
  );
}

const REGEX_EXAMPLES = [
  { label: "IPv4-Adresse", pattern: "^(\\d{1,3}\\.){3}\\d{1,3}$" },
  { label: "E-Mail-Adresse", pattern: "^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$" },
  { label: "Hostname", pattern: "^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$" },
  { label: "MAC-Adresse", pattern: "^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$" },
];

export function RegexTester() {
  const [pattern, setPattern] = useState("^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$");
  const [flags, setFlags] = useState("gm");
  const [testString, setTestString] = useState("admin@example.com\nungueltig");
  let error = "";
  let matches: RegExpMatchArray[] = [];

  try {
    const re = new RegExp(pattern, flags);
    matches = Array.from(testString.matchAll(re.global ? re : new RegExp(pattern, flags + "g")));
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="tool-panel">
      <div className="tool-row">
        {REGEX_EXAMPLES.map((ex) => (
          <button key={ex.label} type="button" className="btn btn-secondary btn-small" onClick={() => setPattern(ex.pattern)}>{ex.label}</button>
        ))}
      </div>
      <div className="tool-row">
        <label className="tool-field" style={{ flex: 1 }}><span>Regex-Muster</span><input value={pattern} onChange={(e) => setPattern(e.target.value)} /></label>
        <label className="tool-field"><span>Flags</span><input value={flags} onChange={(e) => setFlags(e.target.value)} /></label>
      </div>
      <label className="tool-field">
        <span>Test-String</span>
        <textarea rows={5} value={testString} onChange={(e) => setTestString(e.target.value)} />
      </label>
      {error && <p className="tool-error">{error}</p>}
      {!error && <p>{matches.length} Treffer</p>}
      {!error && matches.length > 0 && (
        <ul className="tool-list">
          {matches.map((m, i) => <li key={i}><code>{m[0]}</code></li>)}
        </ul>
      )}
    </div>
  );
}

export function TextDiffChecker() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const diff = a || b ? diffLines(a, b) : [];

  return (
    <div className="tool-panel">
      <div className="tool-row">
        <label className="tool-field" style={{ flex: 1 }}><span>Text A</span><textarea rows={8} value={a} onChange={(e) => setA(e.target.value)} /></label>
        <label className="tool-field" style={{ flex: 1 }}><span>Text B</span><textarea rows={8} value={b} onChange={(e) => setB(e.target.value)} /></label>
      </div>
      {diff.length > 0 && (
        <div className="tool-diff-output">
          {diff.map((line, i) => (
            <div key={i} className={`tool-diff-line tool-diff-${line.type}`}>
              <span className="tool-diff-marker">{line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}</span>
              <span>{line.text || " "}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
