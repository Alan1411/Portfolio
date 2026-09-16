"use client";

import { useState } from "react";
import { CopyButton } from "../CopyButton";
import { calculateSlaDeadline, convertStorageUnit, type StorageUnit } from "@/lib/tools/misc";

export function SlaCalculator() {
  const [start, setStart] = useState("");
  const [slaHours, setSlaHours] = useState(4);
  const [businessHoursOnly, setBusinessHoursOnly] = useState(true);

  let deadline: Date | null = null;
  try {
    if (start) deadline = calculateSlaDeadline(start, slaHours, businessHoursOnly);
  } catch {
    // ungültiges Datum, keine Deadline anzeigen
  }

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Eingangszeitpunkt</span>
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
      </label>
      <label className="tool-field">
        <span>SLA (Stunden)</span>
        <input type="number" value={slaHours} onChange={(e) => setSlaHours(Number(e.target.value))} />
      </label>
      <label className="tool-checkbox">
        <input type="checkbox" checked={businessHoursOnly} onChange={(e) => setBusinessHoursOnly(e.target.checked)} />
        <span>Nur Geschäftszeiten zählen (Mo–Fr, 8–17 Uhr)</span>
      </label>
      {deadline && (
        <div className="tool-result-row">
          <span className="tool-result-label">Deadline</span>
          <code className="tool-result-value">{deadline.toLocaleString("de-DE")}</code>
          <CopyButton text={deadline.toISOString()} />
        </div>
      )}
    </div>
  );
}

export function MaintenanceWindowPlanner() {
  const [system, setSystem] = useState("");
  const [start, setStart] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [leadDays, setLeadDays] = useState(3);

  const startDate = start ? new Date(start) : null;
  const endDate = startDate ? new Date(startDate.getTime() + durationMinutes * 60000) : null;
  const announceDate = startDate ? new Date(startDate.getTime() - leadDays * 86400000) : null;

  const announcement =
    startDate && endDate
      ? `Wartungsfenster: ${system || "System"} ist von ${startDate.toLocaleString("de-DE")} bis ${endDate.toLocaleString("de-DE")} nicht verfügbar. Bitte planen Sie entsprechend.`
      : "";

  return (
    <div className="tool-panel">
      <label className="tool-field"><span>System / Dienst</span><input value={system} onChange={(e) => setSystem(e.target.value)} /></label>
      <div className="tool-row">
        <label className="tool-field"><span>Start</span><input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label className="tool-field"><span>Dauer (Minuten)</span><input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} /></label>
        <label className="tool-field"><span>Vorlauf (Tage)</span><input type="number" value={leadDays} onChange={(e) => setLeadDays(Number(e.target.value))} /></label>
      </div>
      {endDate && announceDate && (
        <div className="tool-result-list">
          <div className="tool-result-row"><span className="tool-result-label">Ende</span><code className="tool-result-value">{endDate.toLocaleString("de-DE")}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Ankündigen bis</span><code className="tool-result-value">{announceDate.toLocaleString("de-DE")}</code></div>
        </div>
      )}
      {announcement && (
        <>
          <label className="tool-field"><span>Ankündigungstext</span><textarea rows={3} readOnly value={announcement} /></label>
          <CopyButton text={announcement} />
        </>
      )}
    </div>
  );
}

const TIMEZONES = [
  "Europe/Berlin", "Europe/London", "America/New_York", "America/Los_Angeles",
  "Asia/Tokyo", "Asia/Singapore", "Asia/Dubai", "Australia/Sydney", "UTC",
];

export function TimezoneComparison() {
  const [selected, setSelected] = useState<string[]>(["Europe/Berlin", "America/New_York", "Asia/Tokyo"]);
  const [now, setNow] = useState(() => new Date());

  function toggle(tz: string) {
    setSelected((s) => (s.includes(tz) ? s.filter((z) => z !== tz) : [...s, tz]));
  }

  return (
    <div className="tool-panel">
      <div className="tool-row">
        {TIMEZONES.map((tz) => (
          <button key={tz} type="button" className={`btn btn-small ${selected.includes(tz) ? "btn-primary" : "btn-secondary"}`} onClick={() => toggle(tz)}>
            {tz}
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-secondary btn-small" onClick={() => setNow(new Date())}>🔄 Aktualisieren</button>
      <div className="tool-result-list">
        {selected.map((tz) => (
          <div key={tz} className="tool-result-row">
            <span className="tool-result-label">{tz}</span>
            <code className="tool-result-value">
              {new Intl.DateTimeFormat("de-DE", { timeZone: tz, dateStyle: "medium", timeStyle: "medium" }).format(now)}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

const STORAGE_UNITS: StorageUnit[] = ["B", "KB", "MB", "GB", "TB", "KiB", "MiB", "GiB", "TiB"];

export function StorageUnitConverter() {
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState<StorageUnit>("GB");
  const result = convertStorageUnit(value, from);

  return (
    <div className="tool-panel">
      <div className="tool-row">
        <label className="tool-field"><span>Wert</span><input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label>
        <label className="tool-field">
          <span>Einheit</span>
          <select value={from} onChange={(e) => setFrom(e.target.value as StorageUnit)}>
            {STORAGE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </label>
      </div>
      <div className="tool-result-list">
        {STORAGE_UNITS.map((u) => (
          <div key={u} className="tool-result-row">
            <span className="tool-result-label">{u}</span>
            <code className="tool-result-value">{result[u].toLocaleString("de-DE", { maximumFractionDigits: 6 })}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
