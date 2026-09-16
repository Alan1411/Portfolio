"use client";

import { useState } from "react";
import { CopyButton } from "../CopyButton";
import { explainCron, buildCron } from "@/lib/tools/cron";
import { calculateAllowedDowntime, calculateUptimeFromDowntime } from "@/lib/tools/misc";

export function CronExplainer() {
  const [expr, setExpr] = useState("*/15 8-17 * * 1-5");
  let explanation = "";
  let error = "";
  try {
    explanation = explainCron(expr);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Cron-Ausdruck</span>
        <input value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="*/15 8-17 * * 1-5" />
      </label>
      <p className="muted" style={{ textAlign: "left" }}>Format: Minute Stunde Tag Monat Wochentag (0=Sonntag)</p>
      {error && <p className="tool-error">{error}</p>}
      {explanation && <p className="tool-check-pass">{explanation}</p>}
    </div>
  );
}

export function CronGenerator() {
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("*");
  const [day, setDay] = useState("*");
  const [month, setMonth] = useState("*");
  const [weekday, setWeekday] = useState("*");

  const expr = buildCron({ minute, hour, day, month, weekday });
  let explanation = "";
  try {
    explanation = explainCron(expr);
  } catch {
    // ignore, Vorschau nur bei gültigem Ausdruck
  }

  return (
    <div className="tool-panel">
      <div className="tool-row">
        <label className="tool-field"><span>Minute</span><input value={minute} onChange={(e) => setMinute(e.target.value)} /></label>
        <label className="tool-field"><span>Stunde</span><input value={hour} onChange={(e) => setHour(e.target.value)} /></label>
        <label className="tool-field"><span>Tag</span><input value={day} onChange={(e) => setDay(e.target.value)} /></label>
        <label className="tool-field"><span>Monat</span><input value={month} onChange={(e) => setMonth(e.target.value)} /></label>
        <label className="tool-field"><span>Wochentag</span><input value={weekday} onChange={(e) => setWeekday(e.target.value)} /></label>
      </div>
      <div className="tool-result-row">
        <code className="tool-result-value">{expr}</code>
        <CopyButton text={expr} />
      </div>
      {explanation && <p className="muted" style={{ textAlign: "left" }}>{explanation}</p>}
    </div>
  );
}

export function UptimeCalculator() {
  const [mode, setMode] = useState<"target" | "measured">("target");
  const [uptime, setUptime] = useState(99.9);
  const [downtimeMinutes, setDowntimeMinutes] = useState(60);
  const [periodDays, setPeriodDays] = useState(30);

  const allowed = calculateAllowedDowntime(uptime);
  const measuredUptime = calculateUptimeFromDowntime(downtimeMinutes, periodDays);

  return (
    <div className="tool-panel">
      <div className="tool-tabs">
        <button type="button" className={mode === "target" ? "active" : ""} onClick={() => setMode("target")}>Erlaubte Downtime</button>
        <button type="button" className={mode === "measured" ? "active" : ""} onClick={() => setMode("measured")}>Uptime aus Downtime</button>
      </div>

      {mode === "target" ? (
        <>
          <label className="tool-field">
            <span>Ziel-Uptime (%)</span>
            <input type="number" step="0.001" value={uptime} onChange={(e) => setUptime(Number(e.target.value))} />
          </label>
          <div className="tool-result-list">
            <div className="tool-result-row"><span className="tool-result-label">Pro Tag</span><code className="tool-result-value">{allowed.perDay}</code></div>
            <div className="tool-result-row"><span className="tool-result-label">Pro Woche</span><code className="tool-result-value">{allowed.perWeek}</code></div>
            <div className="tool-result-row"><span className="tool-result-label">Pro Monat</span><code className="tool-result-value">{allowed.perMonth}</code></div>
            <div className="tool-result-row"><span className="tool-result-label">Pro Jahr</span><code className="tool-result-value">{allowed.perYear}</code></div>
          </div>
        </>
      ) : (
        <>
          <div className="tool-row">
            <label className="tool-field"><span>Downtime (Minuten)</span><input type="number" value={downtimeMinutes} onChange={(e) => setDowntimeMinutes(Number(e.target.value))} /></label>
            <label className="tool-field"><span>Zeitraum (Tage)</span><input type="number" value={periodDays} onChange={(e) => setPeriodDays(Number(e.target.value))} /></label>
          </div>
          <p>Resultierende Uptime: <strong>{measuredUptime.toFixed(3)}%</strong></p>
        </>
      )}
    </div>
  );
}

const SEVERITY_PATTERNS: { label: string; regex: RegExp; className: string }[] = [
  { label: "Kritisch", regex: /\b(CRITICAL|CRIT|FATAL|EMERGENCY)\b/i, className: "tool-log-critical" },
  { label: "Fehler", regex: /\b(ERROR|ERR|FAIL(ED)?|EXCEPTION)\b/i, className: "tool-log-error" },
  { label: "Warnung", regex: /\b(WARN(ING)?)\b/i, className: "tool-log-warning" },
];

export function LogFilterTool() {
  const [log, setLog] = useState("");
  const [customFilter, setCustomFilter] = useState("");
  const [onlyMatches, setOnlyMatches] = useState(true);

  const lines = log.split("\n");
  const processed = lines
    .map((line) => {
      const severity = SEVERITY_PATTERNS.find((p) => p.regex.test(line));
      const customMatch = customFilter && line.toLowerCase().includes(customFilter.toLowerCase());
      return { line, severity, customMatch };
    })
    .filter((l) => (onlyMatches ? l.severity || l.customMatch : true))
    .filter((l) => l.line.trim() !== "");

  const counts = SEVERITY_PATTERNS.map((p) => ({
    label: p.label,
    count: lines.filter((l) => p.regex.test(l)).length,
  }));

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Log-Inhalt</span>
        <textarea rows={8} value={log} onChange={(e) => setLog(e.target.value)} placeholder="Log-Zeilen hier einfügen…" />
      </label>
      <div className="tool-row">
        <label className="tool-field" style={{ flex: 1 }}><span>Zusätzlicher Suchbegriff (optional)</span><input value={customFilter} onChange={(e) => setCustomFilter(e.target.value)} /></label>
        <label className="tool-checkbox"><input type="checkbox" checked={onlyMatches} onChange={(e) => setOnlyMatches(e.target.checked)} /><span>Nur Treffer anzeigen</span></label>
      </div>

      {log && (
        <div className="tool-row" style={{ gap: "1rem" }}>
          {counts.map((c) => <span key={c.label} className="muted">{c.label}: {c.count}</span>)}
        </div>
      )}

      <div className="tool-log-output">
        {processed.map((l, i) => (
          <div key={i} className={`tool-log-line ${l.severity?.className || (l.customMatch ? "tool-log-match" : "")}`}>
            {l.line}
          </div>
        ))}
        {log && processed.length === 0 && <p className="muted">Keine Treffer.</p>}
      </div>
    </div>
  );
}
