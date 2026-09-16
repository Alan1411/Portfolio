// Gemeinsame Typen für die Tool-Sammlung unter /tools

export type ToolCategory =
  | "crypto"
  | "encoding"
  | "security"
  | "network"
  | "ad"
  | "server"
  | "pki"
  | "text"
  | "time"
  | "docs"
  | "fake-data";

export interface ToolMeta {
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  keywords: string[];
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  crypto: "Crypto & Hashing",
  encoding: "Encoding & Decoding",
  security: "Passwörter & Sicherheit",
  network: "Netzwerk & Infrastruktur",
  ad: "Active Directory & User Management",
  server: "Server & Systeme",
  pki: "Zertifikate & PKI",
  text: "Text & Code Utilities",
  time: "Zeitplanung & Berechnung",
  docs: "Dokumentation & Vorlagen",
  "fake-data": "Fake Data Generator",
};

export const CATEGORY_ORDER: ToolCategory[] = [
  "crypto",
  "encoding",
  "security",
  "network",
  "ad",
  "server",
  "pki",
  "text",
  "time",
  "docs",
  "fake-data",
];
