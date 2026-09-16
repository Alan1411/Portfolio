"use client";

import { useState } from "react";
import { CopyButton } from "../CopyButton";
import {
  calculateSubnet,
  generateIpRange,
  generateIpRangeFromCidr,
  lookupMacVendor,
  calculateTransferTime,
  formatDuration,
  KNOWN_PORTS,
} from "@/lib/tools/network";

export function SubnetCalculator() {
  const [cidr, setCidr] = useState("192.168.1.0/24");
  let info = null;
  let error = "";
  try {
    info = calculateSubnet(cidr);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>IP-Adresse / Prefix (CIDR)</span>
        <input value={cidr} onChange={(e) => setCidr(e.target.value)} placeholder="192.168.1.0/24" />
      </label>
      {error && <p className="tool-error">{error}</p>}
      {info && (
        <div className="tool-result-list">
          <div className="tool-result-row"><span className="tool-result-label">Netzadresse</span><code className="tool-result-value">{info.network}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Broadcast</span><code className="tool-result-value">{info.broadcast}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Netzmaske</span><code className="tool-result-value">{info.netmask}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Wildcard-Maske</span><code className="tool-result-value">{info.wildcard}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Erste nutzbare IP</span><code className="tool-result-value">{info.firstHost}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Letzte nutzbare IP</span><code className="tool-result-value">{info.lastHost}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Hosts gesamt</span><code className="tool-result-value">{info.totalHosts}</code></div>
          <div className="tool-result-row"><span className="tool-result-label">Nutzbare Hosts</span><code className="tool-result-value">{info.usableHosts}</code></div>
        </div>
      )}
    </div>
  );
}

export function IpRangeGenerator() {
  const [mode, setMode] = useState<"range" | "cidr">("cidr");
  const [start, setStart] = useState("192.168.1.1");
  const [end, setEnd] = useState("192.168.1.10");
  const [cidr, setCidr] = useState("192.168.1.0/28");
  let ips: string[] = [];
  let error = "";
  try {
    ips = mode === "range" ? generateIpRange(start, end) : generateIpRangeFromCidr(cidr);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="tool-panel">
      <div className="tool-tabs">
        <button type="button" className={mode === "cidr" ? "active" : ""} onClick={() => setMode("cidr")}>Aus CIDR</button>
        <button type="button" className={mode === "range" ? "active" : ""} onClick={() => setMode("range")}>Von–Bis</button>
      </div>
      {mode === "cidr" ? (
        <label className="tool-field">
          <span>CIDR-Block</span>
          <input value={cidr} onChange={(e) => setCidr(e.target.value)} />
        </label>
      ) : (
        <div className="tool-row">
          <label className="tool-field"><span>Start-IP</span><input value={start} onChange={(e) => setStart(e.target.value)} /></label>
          <label className="tool-field"><span>End-IP</span><input value={end} onChange={(e) => setEnd(e.target.value)} /></label>
        </div>
      )}
      {error && <p className="tool-error">{error}</p>}
      {ips.length > 0 && (
        <>
          <div className="tool-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <span className="muted">{ips.length} Adressen</span>
            <CopyButton text={ips.join("\n")} label="Alle kopieren" />
          </div>
          <textarea rows={10} readOnly value={ips.join("\n")} className="tool-output-area" />
        </>
      )}
    </div>
  );
}

export function MacLookup() {
  const [mac, setMac] = useState("");
  const vendor = mac ? lookupMacVendor(mac) : null;

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>MAC-Adresse</span>
        <input value={mac} onChange={(e) => setMac(e.target.value)} placeholder="B8:27:EB:12:34:56" />
      </label>
      {mac && (
        vendor ? (
          <p className="tool-check-pass">Hersteller: <strong>{vendor}</strong></p>
        ) : (
          <p className="muted" style={{ textAlign: "left" }}>Kein Treffer in der lokalen OUI-Liste (deckt nur gängige Hersteller ab, kein vollständiges IEEE-Register).</p>
        )
      )}
    </div>
  );
}

export function BandwidthCalculator() {
  const [size, setSize] = useState(1);
  const [sizeUnit, setSizeUnit] = useState<"MB" | "GB" | "TB">("GB");
  const [speed, setSpeed] = useState(100);
  const [speedUnit, setSpeedUnit] = useState<"Mbit/s" | "Gbit/s">("Mbit/s");

  const seconds = calculateTransferTime(size, sizeUnit, speed, speedUnit);

  return (
    <div className="tool-panel">
      <div className="tool-row">
        <label className="tool-field"><span>Dateigröße</span><input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} /></label>
        <label className="tool-field">
          <span>Einheit</span>
          <select value={sizeUnit} onChange={(e) => setSizeUnit(e.target.value as any)}>
            <option value="MB">MB</option><option value="GB">GB</option><option value="TB">TB</option>
          </select>
        </label>
      </div>
      <div className="tool-row">
        <label className="tool-field"><span>Bandbreite</span><input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
        <label className="tool-field">
          <span>Einheit</span>
          <select value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value as any)}>
            <option value="Mbit/s">Mbit/s</option><option value="Gbit/s">Gbit/s</option>
          </select>
        </label>
      </div>
      <p>Geschätzte Übertragungsdauer: <strong>{formatDuration(seconds)}</strong></p>
    </div>
  );
}

export function PortsReference() {
  const [search, setSearch] = useState("");
  const filtered = KNOWN_PORTS.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return String(p.port).includes(s) || p.service.toLowerCase().includes(s) || p.description.toLowerCase().includes(s);
  });

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Suche</span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Port, Dienst oder Beschreibung…" />
      </label>
      <div className="tool-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Port</th><th>Protokoll</th><th>Dienst</th><th>Beschreibung</th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.port + p.protocol}>
                <td>{p.port}</td><td>{p.protocol}</td><td>{p.service}</td><td>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function UnixTimestampConverter() {
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateInput, setDateInput] = useState("");

  const fromTimestamp = (() => {
    const n = Number(timestamp);
    if (!timestamp || Number.isNaN(n)) return null;
    return new Date(n * 1000);
  })();

  const toTimestamp = dateInput ? Math.floor(new Date(dateInput).getTime() / 1000) : null;

  return (
    <div className="tool-panel">
      <label className="tool-field">
        <span>Unix-Timestamp (Sekunden)</span>
        <input value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
      </label>
      {fromTimestamp && !Number.isNaN(fromTimestamp.getTime()) && (
        <div className="tool-result-row">
          <code className="tool-result-value">{fromTimestamp.toISOString()} ({fromTimestamp.toLocaleString("de-DE")})</code>
          <CopyButton text={fromTimestamp.toISOString()} />
        </div>
      )}

      <label className="tool-field">
        <span>Datum/Uhrzeit</span>
        <input type="datetime-local" value={dateInput} onChange={(e) => setDateInput(e.target.value)} />
      </label>
      {toTimestamp !== null && !Number.isNaN(toTimestamp) && (
        <div className="tool-result-row">
          <code className="tool-result-value">{toTimestamp}</code>
          <CopyButton text={String(toTimestamp)} />
        </div>
      )}

      <button type="button" className="btn btn-secondary btn-small" onClick={() => setTimestamp(String(Math.floor(Date.now() / 1000)))}>
        Jetzt einsetzen
      </button>
    </div>
  );
}

export function DnsLookup() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState("A");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [records, setRecords] = useState<any[]>([]);

  async function lookup() {
    if (!domain) return;
    setStatus("loading");
    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`);
      const data = await res.json();
      setRecords(data.Answer || []);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="tool-panel">
      <p className="muted" style={{ textAlign: "left" }}>Fragt öffentliche DNS-Daten über die Google DNS-over-HTTPS-API ab.</p>
      <div className="tool-row">
        <label className="tool-field" style={{ flex: 1 }}><span>Domain</span><input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" /></label>
        <label className="tool-field">
          <span>Typ</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA"].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      </div>
      <button type="button" className="btn btn-primary" onClick={lookup} disabled={!domain || status === "loading"}>
        {status === "loading" ? "Frage ab…" : "Abfragen"}
      </button>
      {status === "error" && <p className="tool-error">DNS-Abfrage fehlgeschlagen.</p>}
      {status === "done" && (
        records.length === 0 ? <p className="muted">Keine Einträge gefunden.</p> : (
          <div className="tool-result-list">
            {records.map((r, i) => (
              <div key={i} className="tool-result-row">
                <span className="tool-result-label">{r.name}</span>
                <code className="tool-result-value">{r.data}</code>
                <span className="muted">TTL {r.TTL}s</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
