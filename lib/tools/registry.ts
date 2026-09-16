import type { ToolMeta } from "./types";

// Zentrale Metadaten-Liste aller Tools. Dient als Grundlage für die
// Übersichtsseite, die Suche und die dynamische Tool-Route /tools/[slug].
export const TOOLS: ToolMeta[] = [
  // Crypto & Hashing
  { slug: "hash-generator", name: "Hash Generator", category: "crypto", description: "Erzeugt MD5, SHA-1, SHA-256 und SHA-512 Hashes aus Text.", keywords: ["md5", "sha1", "sha256", "sha512", "hash", "checksum"] },
  { slug: "hash-identifier", name: "Hash Identifier", category: "crypto", description: "Erkennt automatisch, um welchen Hash-Typ es sich handeln könnte.", keywords: ["hash", "identify", "erkennen", "md5", "sha1"] },
  { slug: "hmac-generator", name: "HMAC Generator", category: "crypto", description: "Erzeugt HMAC-Signaturen mit Schlüssel (SHA-1/256/512).", keywords: ["hmac", "signatur", "secret", "hash"] },
  { slug: "caesar-cipher", name: "Caesar-Chiffre", category: "crypto", description: "Verschlüsselt und entschlüsselt Text mit der Caesar-Verschiebung.", keywords: ["caesar", "chiffre", "verschlüsseln", "shift"] },
  { slug: "rot13", name: "ROT13", category: "crypto", description: "Kodiert und dekodiert Text mit ROT13.", keywords: ["rot13", "encode", "decode"] },
  { slug: "vigenere-cipher", name: "Vigenère-Chiffre", category: "crypto", description: "Ver- und entschlüsselt Text mit einem Schlüsselwort (Vigenère).", keywords: ["vigenere", "chiffre", "schlüsselwort"] },
  { slug: "aes-encryption", name: "AES-Verschlüsselung", category: "crypto", description: "Verschlüsselt/entschlüsselt Text clientseitig mit AES und Passphrase.", keywords: ["aes", "verschlüsselung", "encryption", "cbc"] },

  // Encoding & Decoding
  { slug: "base64", name: "Base64 En/Decoder", category: "encoding", description: "Kodiert und dekodiert Text im Base64-Format.", keywords: ["base64", "encode", "decode"] },
  { slug: "url-encoding", name: "URL En/Decoder", category: "encoding", description: "Kodiert und dekodiert URL-Komponenten (percent-encoding).", keywords: ["url", "encode", "decode", "percent"] },
  { slug: "html-entities", name: "HTML Entities En/Decoder", category: "encoding", description: "Wandelt Sonderzeichen in HTML-Entities um und zurück.", keywords: ["html", "entities", "encode", "decode"] },
  { slug: "binary-text", name: "Binär ↔ Text", category: "encoding", description: "Konvertiert Text in Binärcode und zurück.", keywords: ["binär", "binary", "text", "konverter"] },
  { slug: "hex-text", name: "Hex ↔ Text", category: "encoding", description: "Konvertiert Text in Hexadezimal und zurück.", keywords: ["hex", "hexadezimal", "text", "konverter"] },
  { slug: "morse-code", name: "Morse-Code En/Decoder", category: "encoding", description: "Wandelt Text in Morsecode um und zurück.", keywords: ["morse", "morsecode", "encode", "decode"] },
  { slug: "number-base-converter", name: "Zahlensystem-Konverter", category: "encoding", description: "Konvertiert Zahlen zwischen Dezimal, Binär, Hex und Oktal.", keywords: ["dezimal", "binär", "hex", "oktal", "zahlensystem"] },
  { slug: "ascii-table", name: "ASCII-Tabelle", category: "encoding", description: "Interaktive ASCII-Tabelle mit Suche nach Zeichen oder Code.", keywords: ["ascii", "tabelle", "zeichen", "code"] },

  // Passwörter & Sicherheit
  { slug: "password-generator", name: "Passwortgenerator", category: "security", description: "Erstellt sichere Passwörter mit konfigurierbaren Optionen.", keywords: ["passwort", "generator", "sicher"] },
  { slug: "password-strength", name: "Passwort-Stärke-Checker", category: "security", description: "Bewertet die Stärke eines Passworts anhand mehrerer Kriterien.", keywords: ["passwort", "stärke", "strength", "check"] },
  { slug: "hibp-checker", name: "Have I Been Pwned Checker", category: "security", description: "Prüft per k-Anonymität, ob ein Passwort in bekannten Leaks vorkommt.", keywords: ["hibp", "pwned", "leak", "breach", "passwort"] },
  { slug: "password-policy-checker", name: "Passwort-Policy Checker", category: "security", description: "Prüft ein Passwort gegen typische Active-Directory-Richtlinien.", keywords: ["ad", "policy", "richtlinie", "passwort", "komplexität"] },

  // Netzwerk & Infrastruktur
  { slug: "subnet-calculator", name: "Subnetz-Rechner", category: "network", description: "Berechnet Netzadresse, Broadcast, Wildcard und Hostanzahl aus CIDR.", keywords: ["subnet", "cidr", "netzmaske", "broadcast", "wildcard"] },
  { slug: "ip-range-generator", name: "IP-Bereich Generator", category: "network", description: "Listet alle IP-Adressen zwischen zwei Grenzen oder in einem CIDR-Block auf.", keywords: ["ip", "range", "bereich", "generator"] },
  { slug: "mac-lookup", name: "MAC-Adresse Lookup", category: "network", description: "Ermittelt den Hersteller (OUI) zu einer MAC-Adresse.", keywords: ["mac", "oui", "hersteller", "vendor"] },
  { slug: "bandwidth-calculator", name: "Bandbreiten-Rechner", category: "network", description: "Berechnet Übertragungsdauer aus Dateigröße und Bandbreite.", keywords: ["bandbreite", "bandwidth", "download", "transfer"] },
  { slug: "ports-reference", name: "Bekannte Ports", category: "network", description: "Durchsuchbare Referenzliste bekannter Ports und Dienste.", keywords: ["ports", "dienste", "referenz", "tcp", "udp"] },
  { slug: "unix-timestamp", name: "Unix-Timestamp Konverter", category: "network", description: "Konvertiert Unix-Timestamps in Datum und umgekehrt.", keywords: ["unix", "timestamp", "epoch", "datum"] },
  { slug: "dns-lookup", name: "DNS-Lookup", category: "network", description: "Fragt DNS-Einträge einer Domain über eine öffentliche API ab.", keywords: ["dns", "lookup", "domain", "records"] },

  // Active Directory & User Management
  { slug: "username-generator", name: "Username-Generator", category: "ad", description: "Erstellt mehrere Benutzername-Formate gleichzeitig aus Vor- und Nachname.", keywords: ["username", "benutzername", "ad", "generator"] },
  { slug: "sid-guid-decoder", name: "SID / GUID Decoder", category: "ad", description: "Analysiert und formatiert Windows SIDs und GUIDs.", keywords: ["sid", "guid", "uuid", "windows", "active directory"] },

  // Server & Systeme
  { slug: "cron-explainer", name: "Cron-Job Erklärer", category: "server", description: "Übersetzt einen Cron-Ausdruck in verständlichen Klartext.", keywords: ["cron", "crontab", "erklärer", "explain"] },
  { slug: "cron-generator", name: "Cron-Job Generator", category: "server", description: "Erstellt aus Klartext-Angaben einen gültigen Cron-Ausdruck.", keywords: ["cron", "crontab", "generator"] },
  { slug: "uptime-calculator", name: "Uptime-Rechner", category: "server", description: "Berechnet Uptime-Prozentsatz und erlaubte Downtime.", keywords: ["uptime", "downtime", "verfügbarkeit", "sla"] },
  { slug: "log-filter", name: "Log-Filter Tool", category: "server", description: "Filtert eingefügte Logs nach Fehlern und markiert Auffälligkeiten.", keywords: ["log", "logs", "filter", "error", "fehler"] },

  // Zertifikate & PKI
  { slug: "ssl-cert-decoder", name: "SSL-Zertifikat Decoder", category: "pki", description: "Zeigt Details eines PEM-Zertifikats an (Subject, Issuer, Gültigkeit, SAN).", keywords: ["ssl", "tls", "zertifikat", "pem", "x509", "decoder"] },
  { slug: "cert-expiry-calculator", name: "Zertifikat Ablauf Rechner", category: "pki", description: "Berechnet die verbleibende Gültigkeitsdauer eines Zertifikats.", keywords: ["zertifikat", "ablauf", "expiry", "gültigkeit"] },
  { slug: "csr-guide", name: "CSR Schritt-für-Schritt Anleitung", category: "pki", description: "Interaktive Anleitung zur Erstellung eines Certificate Signing Requests.", keywords: ["csr", "openssl", "zertifikat", "anleitung"] },

  // Text & Code Utilities
  { slug: "json-formatter", name: "JSON Formatter & Validator", category: "text", description: "Formatiert und validiert JSON-Daten.", keywords: ["json", "formatter", "validator", "pretty"] },
  { slug: "xml-formatter", name: "XML Formatter & Validator", category: "text", description: "Formatiert und validiert XML-Daten.", keywords: ["xml", "formatter", "validator"] },
  { slug: "yaml-formatter", name: "YAML Formatter & Validator", category: "text", description: "Formatiert und validiert YAML-Daten, Konvertierung zu JSON.", keywords: ["yaml", "formatter", "validator"] },
  { slug: "regex-tester", name: "Regex-Tester", category: "text", description: "Testet reguläre Ausdrücke live, mit IT-Beispielen (IP, Mail, Hostname).", keywords: ["regex", "regular expression", "tester", "pattern"] },
  { slug: "text-diff", name: "Text Diff Checker", category: "text", description: "Vergleicht zwei Texte und markiert die Unterschiede.", keywords: ["diff", "vergleich", "text", "unterschied"] },

  // Zeitplanung & Berechnung
  { slug: "sla-calculator", name: "SLA-Rechner", category: "time", description: "Berechnet die Deadline aus Eingangszeitpunkt und SLA-Prozentsatz.", keywords: ["sla", "deadline", "rechner", "ticket"] },
  { slug: "maintenance-window-planner", name: "Wartungsfenster Planer", category: "time", description: "Plant Wartungsfenster inkl. Vorlaufzeit und Ankündigungstext.", keywords: ["wartung", "maintenance", "planer", "fenster"] },
  { slug: "timezone-comparison", name: "Zeitzonenvergleich", category: "time", description: "Vergleicht die aktuelle Uhrzeit über mehrere Zeitzonen hinweg.", keywords: ["zeitzone", "timezone", "vergleich", "uhrzeit"] },
  { slug: "storage-unit-converter", name: "RAM / Storage Einheiten Rechner", category: "time", description: "Konvertiert zwischen GB, GiB, MB, MiB, TB, TiB usw.", keywords: ["gb", "gib", "storage", "ram", "einheiten"] },

  // Dokumentation & Vorlagen
  { slug: "it-ticket-template", name: "IT-Ticket Vorlage Generator", category: "docs", description: "Erstellt eine ausgefüllte IT-Ticket-Vorlage zum Kopieren.", keywords: ["ticket", "vorlage", "template", "it"] },
  { slug: "onboarding-checklist", name: "Onboarding-Checklisten Generator", category: "docs", description: "Erstellt eine Checkliste für das Onboarding neuer Mitarbeiter.", keywords: ["onboarding", "checkliste", "mitarbeiter"] },
  { slug: "password-handover-template", name: "Passwort-Übergabe Vorlage", category: "docs", description: "Druckfertige Vorlage zur sicheren Übergabe von Zugangsdaten.", keywords: ["passwort", "übergabe", "vorlage", "druckfertig"] },
  { slug: "snippet-collection", name: "PowerShell / Bash Snippets", category: "docs", description: "Editierbare Sammlung von PowerShell- und Bash-Snippets (in Supabase gespeichert).", keywords: ["powershell", "bash", "snippet", "sammlung", "script"] },

  // Fake Data Generator
  { slug: "fake-data-generator", name: "Fake Data Generator", category: "fake-data", description: "Generiert realistische deutsche Testdaten: Person, Adresse, Firma, Finanzen, IT-Daten – inkl. Massenexport.", keywords: ["fake", "testdaten", "person", "adresse", "iban", "generator", "csv", "export"] },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolMeta[] {
  return TOOLS.filter((t) => t.category === category);
}
