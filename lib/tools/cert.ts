// Minimaler clientseitiger X.509/DER-Parser für den SSL-Zertifikat Decoder.
// Es wird bewusst keine externe PKI-Bibliothek genutzt – der Parser liest nur
// die für die Anzeige relevanten Felder aus dem ASN.1/DER-Baum.

interface Tlv {
  tagClass: number;
  constructed: boolean;
  tagNumber: number;
  contentStart: number;
  contentEnd: number;
  nextOffset: number;
}

function readTlv(buf: Uint8Array, offset: number): Tlv {
  const first = buf[offset];
  const tagClass = (first & 0xc0) >> 6;
  const constructed = (first & 0x20) !== 0;
  let tagNumber = first & 0x1f;
  let pos = offset + 1;

  if (tagNumber === 0x1f) {
    tagNumber = 0;
    while (buf[pos] & 0x80) {
      tagNumber = (tagNumber << 7) | (buf[pos] & 0x7f);
      pos++;
    }
    tagNumber = (tagNumber << 7) | (buf[pos] & 0x7f);
    pos++;
  }

  const lenByte = buf[pos];
  pos++;
  let length: number;
  if (lenByte & 0x80) {
    const numBytes = lenByte & 0x7f;
    length = 0;
    for (let i = 0; i < numBytes; i++) {
      length = (length << 8) | buf[pos];
      pos++;
    }
  } else {
    length = lenByte;
  }

  return {
    tagClass,
    constructed,
    tagNumber,
    contentStart: pos,
    contentEnd: pos + length,
    nextOffset: pos + length,
  };
}

function children(buf: Uint8Array, tlv: Tlv): Tlv[] {
  const result: Tlv[] = [];
  let offset = tlv.contentStart;
  while (offset < tlv.contentEnd) {
    const child = readTlv(buf, offset);
    result.push(child);
    offset = child.nextOffset;
  }
  return result;
}

function parseOid(buf: Uint8Array, tlv: Tlv): string {
  const bytes = buf.slice(tlv.contentStart, tlv.contentEnd);
  const first = bytes[0];
  const parts = [Math.floor(first / 40), first % 40];
  let value = 0;
  for (let i = 1; i < bytes.length; i++) {
    value = (value << 7) | (bytes[i] & 0x7f);
    if ((bytes[i] & 0x80) === 0) {
      parts.push(value);
      value = 0;
    }
  }
  return parts.join(".");
}

function parseString(buf: Uint8Array, tlv: Tlv): string {
  return new TextDecoder("utf-8").decode(buf.slice(tlv.contentStart, tlv.contentEnd));
}

function parseInt(buf: Uint8Array, tlv: Tlv): bigint {
  let result = BigInt(0);
  for (let i = tlv.contentStart; i < tlv.contentEnd; i++) {
    result = (result << BigInt(8)) | BigInt(buf[i]);
  }
  return result;
}

function parseTime(buf: Uint8Array, tlv: Tlv): Date {
  const raw = parseString(buf, tlv);
  const isUtc = tlv.tagNumber === 23;
  const m = isUtc
    ? raw.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/)
    : raw.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/);
  if (!m) throw new Error(`Unbekanntes Zeitformat: ${raw}`);
  let year: number;
  if (isUtc) {
    const yy = Number(m[1]);
    year = yy < 50 ? 2000 + yy : 1900 + yy;
  } else {
    year = Number(m[1]);
  }
  const [, , mo, d, h, mi, s] = m;
  return new Date(Date.UTC(year, Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s)));
}

const OID_NAMES: Record<string, string> = {
  "2.5.4.3": "CN",
  "2.5.4.6": "C",
  "2.5.4.7": "L",
  "2.5.4.8": "ST",
  "2.5.4.10": "O",
  "2.5.4.11": "OU",
  "1.2.840.113549.1.9.1": "emailAddress",
};

const SIG_ALG_NAMES: Record<string, string> = {
  "1.2.840.113549.1.1.5": "SHA-1 mit RSA",
  "1.2.840.113549.1.1.11": "SHA-256 mit RSA",
  "1.2.840.113549.1.1.12": "SHA-384 mit RSA",
  "1.2.840.113549.1.1.13": "SHA-512 mit RSA",
  "1.2.840.10045.4.3.2": "ECDSA mit SHA-256",
  "1.2.840.10045.4.3.3": "ECDSA mit SHA-384",
  "1.2.840.10045.4.3.4": "ECDSA mit SHA-512",
  "1.2.840.113549.1.1.1": "RSA",
  "1.2.840.10045.2.1": "EC (Elliptic Curve)",
};

function parseName(buf: Uint8Array, tlv: Tlv): string {
  const rdns = children(buf, tlv); // SET OF RelativeDistinguishedName
  const pairs: string[] = [];
  for (const rdn of rdns) {
    for (const atv of children(buf, rdn)) {
      // AttributeTypeAndValue ::= SEQUENCE { type OID, value ANY }
      const [oidTlv, valueTlv] = children(buf, atv);
      const oid = parseOid(buf, oidTlv);
      const name = OID_NAMES[oid] || oid;
      pairs.push(`${name}=${parseString(buf, valueTlv)}`);
    }
  }
  return pairs.join(", ");
}

export interface CertificateInfo {
  subject: string;
  issuer: string;
  notBefore: Date;
  notAfter: Date;
  serialNumber: string;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  subjectAltNames: string[];
  fingerprintSha256: string;
  isExpired: boolean;
  daysUntilExpiry: number;
}

export function pemToDer(pem: string): Uint8Array {
  const base64 = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  if (!base64) throw new Error("Kein gültiges PEM-Zertifikat erkannt");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function decodeCertificate(pem: string): Promise<CertificateInfo> {
  const der = pemToDer(pem);
  const certificate = readTlv(der, 0); // SEQUENCE Certificate
  const [tbsCertificate] = children(der, certificate);
  const tbsChildren = children(der, tbsCertificate);

  let idx = 0;
  // version ist [0] EXPLICIT und optional – nur vorhanden wenn context-tag 0
  if (tbsChildren[idx].tagClass === 2 && tbsChildren[idx].tagNumber === 0) idx++;

  const serialTlv = tbsChildren[idx++];
  const signatureAlgTlv = tbsChildren[idx++];
  const issuerTlv = tbsChildren[idx++];
  const validityTlv = tbsChildren[idx++];
  const subjectTlv = tbsChildren[idx++];
  const subjectPublicKeyInfoTlv = tbsChildren[idx++];

  let extensions: Tlv | null = null;
  for (let i = idx; i < tbsChildren.length; i++) {
    if (tbsChildren[i].tagClass === 2 && tbsChildren[i].tagNumber === 3) {
      extensions = tbsChildren[i];
      break;
    }
  }

  const serialNumber = parseInt(der, serialTlv).toString(16).toUpperCase();
  const [sigOidTlv] = children(der, signatureAlgTlv);
  const sigOid = parseOid(der, sigOidTlv);

  const [notBeforeTlv, notAfterTlv] = children(der, validityTlv);
  const notBefore = parseTime(der, notBeforeTlv);
  const notAfter = parseTime(der, notAfterTlv);

  const [pubKeyAlgTlv] = children(der, subjectPublicKeyInfoTlv);
  const [pubKeyOidTlv] = children(der, pubKeyAlgTlv);
  const pubKeyOid = parseOid(der, pubKeyOidTlv);

  const subjectAltNames: string[] = [];
  if (extensions) {
    // [3] EXPLICIT SEQUENCE OF Extension
    const [extSeq] = children(der, extensions);
    for (const ext of children(der, extSeq)) {
      const extChildren = children(der, ext);
      const extOid = parseOid(der, extChildren[0]);
      if (extOid === "2.5.29.17") {
        // subjectAltName: OCTET STRING enthält GeneralNames SEQUENCE
        const octetStringTlv = extChildren[extChildren.length - 1];
        const generalNames = readTlv(der, octetStringTlv.contentStart);
        for (const gn of children(der, generalNames)) {
          if (gn.tagNumber === 2) subjectAltNames.push(`DNS:${parseString(der, gn)}`);
          else if (gn.tagNumber === 1) subjectAltNames.push(`Email:${parseString(der, gn)}`);
          else if (gn.tagNumber === 7) {
            const ipBytes = der.slice(gn.contentStart, gn.contentEnd);
            subjectAltNames.push(`IP:${Array.from(ipBytes).join(".")}`);
          }
        }
      }
    }
  }

  const digest = await crypto.subtle.digest("SHA-256", der as BufferSource);
  const fingerprintSha256 = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join(":");

  const now = new Date();
  const daysUntilExpiry = Math.floor((notAfter.getTime() - now.getTime()) / 86400000);

  return {
    subject: parseName(der, subjectTlv),
    issuer: parseName(der, issuerTlv),
    notBefore,
    notAfter,
    serialNumber,
    signatureAlgorithm: SIG_ALG_NAMES[sigOid] || sigOid,
    publicKeyAlgorithm: SIG_ALG_NAMES[pubKeyOid] || pubKeyOid,
    subjectAltNames,
    fingerprintSha256,
    isExpired: now > notAfter,
    daysUntilExpiry,
  };
}
