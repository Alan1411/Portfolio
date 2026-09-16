// Active Directory Hilfsfunktionen: Username-Generator, SID/GUID Decoder

function normalize(part: string): string {
  return part
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Umlaute/Akzente entfernen
    .replace(/ß/g, "ss")
    .replace(/[^a-z-]/g, "");
}

export function generateUsernames(firstName: string, lastName: string): { format: string; value: string }[] {
  const f = normalize(firstName);
  const l = normalize(lastName);
  if (!f || !l) return [];

  return [
    { format: "vorname.nachname", value: `${f}.${l}` },
    { format: "v.nachname", value: `${f[0]}.${l}` },
    { format: "vornamen", value: `${f}${l}` },
    { format: "nachnamev", value: `${l}${f[0]}` },
    { format: "nachname.vorname", value: `${l}.${f}` },
    { format: "vorname_nachname", value: `${f}_${l}` },
    { format: "vorname (7 Zeichen Nachname)", value: `${f}${l.substring(0, 7)}` },
    { format: "erste 3 + erste 3", value: `${f.substring(0, 3)}${l.substring(0, 3)}` },
  ];
}

const WELL_KNOWN_RIDS: Record<string, string> = {
  "500": "Administrator",
  "501": "Gast (Guest)",
  "502": "KRBTGT (Kerberos-Dienstkonto)",
  "512": "Domänen-Admins",
  "513": "Domänen-Benutzer",
  "514": "Domänen-Gäste",
  "515": "Domänencomputer",
  "516": "Domänencontroller",
  "518": "Schema-Admins",
  "519": "Organisations-Admins (Enterprise Admins)",
  "520": "Richtlinien-Ersteller-Besitzer (Group Policy Creator Owners)",
};

export interface SidBreakdown {
  raw: string;
  revision: string;
  identifierAuthority: string;
  subAuthorities: string[];
  rid: string;
  wellKnown?: string;
}

// Windows SID Format: S-Revision-Authority-SubAuthority1-SubAuthority2-...-RID
export function decodeSid(sid: string): SidBreakdown {
  const parts = sid.trim().split("-");
  if (parts.length < 4 || parts[0].toUpperCase() !== "S") {
    throw new Error("Ungültiges SID-Format. Erwartet: S-1-5-21-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-RID");
  }

  const revision = parts[1];
  const identifierAuthority = parts[2];
  const subAuthorities = parts.slice(3, -1);
  const rid = parts[parts.length - 1];

  return {
    raw: sid.trim(),
    revision,
    identifierAuthority,
    subAuthorities,
    rid,
    wellKnown: WELL_KNOWN_RIDS[rid],
  };
}

const GUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export interface GuidBreakdown {
  raw: string;
  timeLow: string;
  timeMid: string;
  timeHiAndVersion: string;
  clockSeq: string;
  node: string;
  version: number;
  variant: string;
}

export function decodeGuid(guid: string): GuidBreakdown {
  const clean = guid.trim().replace(/[{}]/g, "");
  if (!GUID_REGEX.test(clean)) {
    throw new Error("Ungültiges GUID/UUID-Format. Erwartet: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
  }

  const [timeLow, timeMid, timeHiAndVersion, clockSeq, node] = clean.split("-");
  const version = parseInt(timeHiAndVersion[0], 16);

  const variantBits = parseInt(clockSeq[0], 16);
  let variant = "Unbekannt";
  if ((variantBits & 0b1000) === 0) variant = "NCS (reserviert)";
  else if ((variantBits & 0b1100) === 0b1000) variant = "RFC 4122 (Standard)";
  else if ((variantBits & 0b1110) === 0b1100) variant = "Microsoft (reserviert)";

  return { raw: clean, timeLow, timeMid, timeHiAndVersion, clockSeq, node, version, variant };
}

export function generateGuid(): string {
  return crypto.randomUUID();
}
