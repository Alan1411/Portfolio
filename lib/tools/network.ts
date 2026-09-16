// Netzwerk-Hilfsfunktionen: Subnetting, IP-Bereiche, Bandbreite

export function ipToLong(ip: string): number {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) throw new Error("Ungültige IPv4-Adresse");
  let result = 0;
  for (const part of parts) {
    const n = Number(part);
    if (!Number.isInteger(n) || n < 0 || n > 255) throw new Error("Ungültige IPv4-Adresse");
    result = (result << 8) + n;
  }
  return result >>> 0;
}

export function longToIp(long: number): string {
  return [24, 16, 8, 0].map((shift) => (long >>> shift) & 255).join(".");
}

export interface SubnetInfo {
  network: string;
  broadcast: string;
  netmask: string;
  wildcard: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  cidr: number;
}

export function calculateSubnet(cidrInput: string): SubnetInfo {
  const [ipPart, prefixPart] = cidrInput.trim().split("/");
  const prefix = Number(prefixPart);
  if (!ipPart || Number.isNaN(prefix) || prefix < 0 || prefix > 32) {
    throw new Error("Bitte im Format IP/Prefix angeben, z.B. 192.168.1.0/24");
  }

  const ipLong = ipToLong(ipPart);
  const maskLong = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const networkLong = (ipLong & maskLong) >>> 0;
  const wildcardLong = (~maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;

  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? 0 : totalHosts - 2;

  return {
    network: longToIp(networkLong),
    broadcast: longToIp(broadcastLong),
    netmask: longToIp(maskLong),
    wildcard: longToIp(wildcardLong),
    firstHost: usableHosts > 0 ? longToIp(networkLong + 1) : longToIp(networkLong),
    lastHost: usableHosts > 0 ? longToIp(broadcastLong - 1) : longToIp(broadcastLong),
    totalHosts,
    usableHosts,
    cidr: prefix,
  };
}

// Generiert alle IPs zwischen zwei Grenzen oder in einem CIDR-Block (mit Obergrenze für die UI)
export function generateIpRange(start: string, end: string, limit = 1000): string[] {
  const startLong = ipToLong(start);
  const endLong = ipToLong(end);
  if (endLong < startLong) throw new Error("Endadresse muss größer als die Startadresse sein");
  const count = endLong - startLong + 1;
  if (count > limit) throw new Error(`Bereich zu groß (${count} Adressen), maximal ${limit} erlaubt`);

  const result: string[] = [];
  for (let i = startLong; i <= endLong; i++) result.push(longToIp(i));
  return result;
}

export function generateIpRangeFromCidr(cidr: string, limit = 1000): string[] {
  const info = calculateSubnet(cidr);
  const startLong = ipToLong(info.network);
  const endLong = ipToLong(info.broadcast);
  if (endLong - startLong + 1 > limit) {
    throw new Error(`Subnetz zu groß (${endLong - startLong + 1} Adressen), maximal ${limit} erlaubt`);
  }
  const result: string[] = [];
  for (let i = startLong; i <= endLong; i++) result.push(longToIp(i));
  return result;
}

// Bandbreiten-Rechner: Übertragungsdauer aus Dateigröße + Bandbreite
export function calculateTransferTime(sizeValue: number, sizeUnit: "MB" | "GB" | "TB", speedValue: number, speedUnit: "Mbit/s" | "Gbit/s"): number {
  const sizeBytes = sizeValue * (sizeUnit === "MB" ? 1e6 : sizeUnit === "GB" ? 1e9 : 1e12);
  const sizeBits = sizeBytes * 8;
  const speedBits = speedValue * (speedUnit === "Mbit/s" ? 1e6 : 1e9);
  return sizeBits / speedBits; // Sekunden
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "–";
  if (seconds < 60) return `${seconds.toFixed(1)} Sek.`;
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [];
  if (d) parts.push(`${d} T.`);
  if (h) parts.push(`${h} Std.`);
  if (m) parts.push(`${m} Min.`);
  if (!d && s) parts.push(`${s} Sek.`);
  return parts.join(" ") || "0 Sek.";
}

// Bekannte MAC-Adress-Präfixe (OUI) -> Hersteller. Kein vollständiges IEEE-Register,
// deckt aber die gängigsten Hersteller im IT-Alltag ab.
export const OUI_VENDORS: Record<string, string> = {
  "00:1A:2B": "Ayecom Technology",
  "00:03:93": "Apple, Inc.",
  "00:05:02": "Apple, Inc.",
  "00:0A:27": "Apple, Inc.",
  "00:0A:95": "Apple, Inc.",
  "00:0D:93": "Apple, Inc.",
  "00:16:CB": "Apple, Inc.",
  "00:17:F2": "Apple, Inc.",
  "00:19:E3": "Apple, Inc.",
  "00:1B:63": "Apple, Inc.",
  "00:1E:C2": "Apple, Inc.",
  "00:1F:F3": "Apple, Inc.",
  "3C:07:54": "Apple, Inc.",
  "A4:5E:60": "Apple, Inc.",
  "F0:18:98": "Apple, Inc.",
  "00:1B:21": "Intel Corporation",
  "00:1E:65": "Intel Corporation",
  "00:1F:3B": "Intel Corporation",
  "3C:A9:F4": "Intel Corporation",
  "AC:7B:A1": "Intel Corporation",
  "F4:8E:38": "Intel Corporation",
  "00:14:22": "Dell Inc.",
  "00:1A:A0": "Dell Inc.",
  "00:1C:23": "Dell Inc.",
  "00:21:9B": "Dell Inc.",
  "18:03:73": "Dell Inc.",
  "B8:CA:3A": "Dell Inc.",
  "00:0A:E4": "Hewlett Packard",
  "00:1F:29": "Hewlett Packard",
  "00:23:7D": "Hewlett Packard",
  "3C:D9:2B": "Hewlett Packard",
  "9C:8E:99": "Hewlett Packard",
  "00:00:0C": "Cisco Systems, Inc.",
  "00:01:42": "Cisco Systems, Inc.",
  "00:0E:D6": "Cisco Systems, Inc.",
  "00:1B:D4": "Cisco Systems, Inc.",
  "00:1C:57": "Cisco Systems, Inc.",
  "00:1D:70": "Cisco Systems, Inc.",
  "00:50:56": "VMware, Inc.",
  "00:0C:29": "VMware, Inc.",
  "00:05:69": "VMware, Inc.",
  "08:00:27": "Oracle VirtualBox (PCS Systemtechnik)",
  "52:54:00": "QEMU / libvirt (virtuelle NIC)",
  "00:15:5D": "Microsoft Hyper-V",
  "00:03:FF": "Microsoft Corp.",
  "00:12:5A": "Microsoft Corp.",
  "B8:27:EB": "Raspberry Pi Foundation",
  "DC:A6:32": "Raspberry Pi Foundation (Trading) Ltd",
  "E4:5F:01": "Raspberry Pi Trading Ltd",
  "00:16:6F": "Samsung Electronics",
  "00:1D:25": "Samsung Electronics",
  "5C:0A:5B": "Samsung Electronics",
  "00:1E:10": "Huawei Technologies",
  "00:25:9E": "Huawei Technologies",
  "4C:1F:CC": "Huawei Technologies",
  "00:1E:8C": "ASUSTek Computer Inc.",
  "1C:87:2C": "ASUSTek Computer Inc.",
  "00:24:8C": "ASRock Incorporation",
  "00:26:B9": "Dell Inc.",
  "70:8B:CD": "Dell Inc.",
  "00:E0:4C": "Realtek Semiconductor Corp.",
  "52:74:00": "Realtek Semiconductor Corp.",
  "00:1F:16": "Netgear",
  "00:26:F2": "Netgear",
  "A0:40:A0": "Netgear",
  "00:1D:7E": "TP-Link Technologies",
  "50:C7:BF": "TP-Link Technologies",
  "F4:F2:6D": "TP-Link Technologies",
  "00:18:39": "AVM GmbH (Fritz!Box)",
  "34:31:C4": "AVM GmbH (Fritz!Box)",
  "00:1B:0C": "Fortinet, Inc.",
  "00:09:0F": "Fortinet, Inc.",
  "00:1B:17": "Juniper Networks",
  "00:05:85": "Juniper Networks",
  "FC:FB:FB": "Cisco Systems, Inc.",
  "F8:F0:82": "Ubiquiti Networks Inc.",
  "24:A4:3C": "Ubiquiti Networks Inc.",
  "DC:9F:DB": "Ubiquiti Networks Inc.",
  "00:1D:D8": "Microsoft Corp.",
};

export function lookupMacVendor(mac: string): string | null {
  const clean = mac.trim().toUpperCase().replace(/[-.]/g, ":");
  const prefix = clean.split(":").slice(0, 3).join(":");
  return OUI_VENDORS[prefix] || null;
}

// Referenzliste bekannter Ports
export interface PortEntry {
  port: number;
  protocol: "TCP" | "UDP" | "TCP/UDP";
  service: string;
  description: string;
}

export const KNOWN_PORTS: PortEntry[] = [
  { port: 20, protocol: "TCP", service: "FTP-DATA", description: "FTP Datenübertragung" },
  { port: 21, protocol: "TCP", service: "FTP", description: "File Transfer Protocol – Steuerung" },
  { port: 22, protocol: "TCP", service: "SSH", description: "Secure Shell (Remote-Zugriff)" },
  { port: 23, protocol: "TCP", service: "Telnet", description: "Unverschlüsselter Remote-Zugriff" },
  { port: 25, protocol: "TCP", service: "SMTP", description: "E-Mail-Versand" },
  { port: 42, protocol: "TCP/UDP", service: "WINS", description: "Windows Internet Name Service" },
  { port: 53, protocol: "TCP/UDP", service: "DNS", description: "Domain Name System" },
  { port: 67, protocol: "UDP", service: "DHCP (Server)", description: "Dynamic Host Configuration Protocol" },
  { port: 68, protocol: "UDP", service: "DHCP (Client)", description: "Dynamic Host Configuration Protocol" },
  { port: 69, protocol: "UDP", service: "TFTP", description: "Trivial File Transfer Protocol" },
  { port: 80, protocol: "TCP", service: "HTTP", description: "Web-Verkehr (unverschlüsselt)" },
  { port: 88, protocol: "TCP/UDP", service: "Kerberos", description: "Authentifizierungsprotokoll (AD)" },
  { port: 110, protocol: "TCP", service: "POP3", description: "E-Mail-Abruf" },
  { port: 111, protocol: "TCP/UDP", service: "RPCBIND", description: "ONC RPC Portmapper" },
  { port: 119, protocol: "TCP", service: "NNTP", description: "Network News Transfer Protocol" },
  { port: 123, protocol: "UDP", service: "NTP", description: "Network Time Protocol" },
  { port: 135, protocol: "TCP", service: "MS RPC", description: "Microsoft RPC Endpoint Mapper" },
  { port: 137, protocol: "UDP", service: "NetBIOS-NS", description: "NetBIOS Name Service" },
  { port: 138, protocol: "UDP", service: "NetBIOS-DGM", description: "NetBIOS Datagram Service" },
  { port: 139, protocol: "TCP", service: "NetBIOS-SSN", description: "NetBIOS Session Service" },
  { port: 143, protocol: "TCP", service: "IMAP", description: "E-Mail-Abruf (mit Ordnerstruktur)" },
  { port: 161, protocol: "UDP", service: "SNMP", description: "Simple Network Management Protocol" },
  { port: 162, protocol: "UDP", service: "SNMP-TRAP", description: "SNMP Traps" },
  { port: 179, protocol: "TCP", service: "BGP", description: "Border Gateway Protocol" },
  { port: 389, protocol: "TCP/UDP", service: "LDAP", description: "Lightweight Directory Access Protocol" },
  { port: 402, protocol: "TCP", service: "Altiris", description: "Altiris/Symantec Client Service" },
  { port: 443, protocol: "TCP", service: "HTTPS", description: "Web-Verkehr (TLS-verschlüsselt)" },
  { port: 445, protocol: "TCP", service: "SMB", description: "Server Message Block (Windows-Freigaben)" },
  { port: 464, protocol: "TCP/UDP", service: "Kerberos (Passwort ändern)", description: "Kerberos Change/Set Password" },
  { port: 465, protocol: "TCP", service: "SMTPS", description: "SMTP über TLS" },
  { port: 500, protocol: "UDP", service: "ISAKMP/IKE", description: "IPsec VPN Schlüsselaustausch" },
  { port: 514, protocol: "UDP", service: "Syslog", description: "Log-Nachrichten" },
  { port: 515, protocol: "TCP", service: "LPD", description: "Line Printer Daemon" },
  { port: 520, protocol: "UDP", service: "RIP", description: "Routing Information Protocol" },
  { port: 543, protocol: "TCP", service: "Kerberos Login", description: "Kerberos-authentifizierter Login" },
  { port: 546, protocol: "UDP", service: "DHCPv6 (Client)", description: "DHCP für IPv6" },
  { port: 547, protocol: "UDP", service: "DHCPv6 (Server)", description: "DHCP für IPv6" },
  { port: 587, protocol: "TCP", service: "SMTP (Submission)", description: "E-Mail-Versand mit Authentifizierung" },
  { port: 631, protocol: "TCP/UDP", service: "IPP/CUPS", description: "Internet Printing Protocol" },
  { port: 636, protocol: "TCP", service: "LDAPS", description: "LDAP über TLS" },
  { port: 989, protocol: "TCP", service: "FTPS-DATA", description: "FTP über TLS – Daten" },
  { port: 990, protocol: "TCP", service: "FTPS", description: "FTP über TLS – Steuerung" },
  { port: 993, protocol: "TCP", service: "IMAPS", description: "IMAP über TLS" },
  { port: 995, protocol: "TCP", service: "POP3S", description: "POP3 über TLS" },
  { port: 1433, protocol: "TCP", service: "MSSQL", description: "Microsoft SQL Server" },
  { port: 1521, protocol: "TCP", service: "Oracle DB", description: "Oracle Database Listener" },
  { port: 1723, protocol: "TCP", service: "PPTP", description: "Point-to-Point Tunneling Protocol (VPN)" },
  { port: 1812, protocol: "UDP", service: "RADIUS (Auth)", description: "RADIUS Authentifizierung" },
  { port: 1813, protocol: "UDP", service: "RADIUS (Accounting)", description: "RADIUS Accounting" },
  { port: 2049, protocol: "TCP/UDP", service: "NFS", description: "Network File System" },
  { port: 2379, protocol: "TCP", service: "etcd (Client)", description: "etcd Key-Value-Store API" },
  { port: 2483, protocol: "TCP", service: "Oracle DB", description: "Oracle DB (unverschlüsselt)" },
  { port: 2484, protocol: "TCP", service: "Oracle DB (TLS)", description: "Oracle DB über TLS" },
  { port: 3268, protocol: "TCP", service: "Global Catalog (LDAP)", description: "Active Directory Global Catalog" },
  { port: 3269, protocol: "TCP", service: "Global Catalog (LDAPS)", description: "AD Global Catalog über TLS" },
  { port: 3306, protocol: "TCP", service: "MySQL/MariaDB", description: "MySQL/MariaDB Datenbank" },
  { port: 3389, protocol: "TCP", service: "RDP", description: "Remote Desktop Protocol" },
  { port: 3690, protocol: "TCP", service: "SVN", description: "Subversion Versionskontrolle" },
  { port: 4443, protocol: "TCP", service: "Alt-HTTPS", description: "Alternativer HTTPS-Port" },
  { port: 5000, protocol: "TCP", service: "Docker Registry / UPnP", description: "Docker Registry API bzw. UPnP" },
  { port: 5060, protocol: "TCP/UDP", service: "SIP", description: "Session Initiation Protocol (VoIP)" },
  { port: 5061, protocol: "TCP", service: "SIP-TLS", description: "SIP über TLS" },
  { port: 5222, protocol: "TCP", service: "XMPP", description: "Extensible Messaging (Jabber)" },
  { port: 5432, protocol: "TCP", service: "PostgreSQL", description: "PostgreSQL Datenbank" },
  { port: 5900, protocol: "TCP", service: "VNC", description: "Virtual Network Computing" },
  { port: 5985, protocol: "TCP", service: "WinRM (HTTP)", description: "Windows Remote Management" },
  { port: 5986, protocol: "TCP", service: "WinRM (HTTPS)", description: "Windows Remote Management über TLS" },
  { port: 6379, protocol: "TCP", service: "Redis", description: "Redis Key-Value-Store" },
  { port: 6443, protocol: "TCP", service: "Kubernetes API", description: "Kubernetes API-Server" },
  { port: 8080, protocol: "TCP", service: "HTTP-Alt", description: "Alternativer HTTP-Port / Proxy" },
  { port: 8443, protocol: "TCP", service: "HTTPS-Alt", description: "Alternativer HTTPS-Port" },
  { port: 8888, protocol: "TCP", service: "HTTP-Alt", description: "Alternativer HTTP-Port (z.B. Jupyter)" },
  { port: 9000, protocol: "TCP", service: "PHP-FPM / SonarQube", description: "Diverse Anwendungsdienste" },
  { port: 9092, protocol: "TCP", service: "Kafka", description: "Apache Kafka Broker" },
  { port: 9100, protocol: "TCP", service: "Node Exporter", description: "Prometheus Node Exporter" },
  { port: 9200, protocol: "TCP", service: "Elasticsearch", description: "Elasticsearch REST-API" },
  { port: 27017, protocol: "TCP", service: "MongoDB", description: "MongoDB Datenbank" },
];
