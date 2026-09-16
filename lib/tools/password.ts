import CryptoJS from "crypto-js";

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
};
const AMBIGUOUS = /[Il1O0]/g;

// Nutzt Web Crypto (crypto.getRandomValues) statt Math.random für sichere Zufallszahlen
export function generatePassword(opts: PasswordOptions): string {
  let charset = "";
  if (opts.uppercase) charset += CHARSETS.uppercase;
  if (opts.lowercase) charset += CHARSETS.lowercase;
  if (opts.numbers) charset += CHARSETS.numbers;
  if (opts.symbols) charset += CHARSETS.symbols;
  if (opts.excludeAmbiguous) charset = charset.replace(AMBIGUOUS, "");

  if (!charset) throw new Error("Mindestens eine Zeichenart muss ausgewählt sein");

  const randomValues = new Uint32Array(opts.length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (v) => charset[v % charset.length]).join("");
}

export interface PasswordStrengthResult {
  score: number; // 0-4
  label: string;
  entropyBits: number;
  checks: { label: string; passed: boolean }[];
}

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const checks = [
    { label: "Mindestens 8 Zeichen", passed: password.length >= 8 },
    { label: "Mindestens 12 Zeichen", passed: password.length >= 12 },
    { label: "Enthält Großbuchstaben", passed: /[A-Z]/.test(password) },
    { label: "Enthält Kleinbuchstaben", passed: /[a-z]/.test(password) },
    { label: "Enthält Zahlen", passed: /[0-9]/.test(password) },
    { label: "Enthält Sonderzeichen", passed: /[^A-Za-z0-9]/.test(password) },
    { label: "Keine einfachen Wiederholungen (z.B. aaa, 111)", passed: !/(.)\1{2,}/.test(password) },
  ];

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) poolSize += 32;
  const entropyBits = password.length && poolSize ? Math.round(password.length * Math.log2(poolSize)) : 0;

  const passedCount = checks.filter((c) => c.passed).length;
  let score = 0;
  if (entropyBits >= 28) score = 1;
  if (entropyBits >= 36 && passedCount >= 4) score = 2;
  if (entropyBits >= 60 && passedCount >= 5) score = 3;
  if (entropyBits >= 80 && passedCount >= 6) score = 4;
  if (password.length === 0) score = 0;

  const labels = ["Sehr schwach", "Schwach", "Okay", "Stark", "Sehr stark"];

  return { score, label: labels[score], entropyBits, checks };
}

// Have I Been Pwned – Pwned Passwords API per k-Anonymität:
// Nur die ersten 5 Zeichen des SHA-1-Hashes werden an die API gesendet,
// das vollständige Passwort verlässt niemals den Browser.
export async function checkPwnedPassword(password: string): Promise<number> {
  const hash = CryptoJS.SHA1(password).toString().toUpperCase();
  const prefix = hash.substring(0, 5);
  const suffix = hash.substring(5);

  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { "Add-Padding": "true" },
  });
  if (!response.ok) throw new Error("HIBP-API nicht erreichbar");

  const text = await response.text();
  const line = text.split("\n").find((l) => l.startsWith(suffix));
  if (!line) return 0;
  const count = Number(line.split(":")[1]);
  return Number.isNaN(count) ? 0 : count;
}

// Typische Active-Directory-Passwort-Komplexitätsrichtlinie (Microsoft-Default)
export interface PolicyResult {
  rule: string;
  passed: boolean;
}

export function checkAdPasswordPolicy(password: string, minLength = 8): PolicyResult[] {
  const categories = [
    /[A-Z]/.test(password), // Großbuchstaben
    /[a-z]/.test(password), // Kleinbuchstaben
    /[0-9]/.test(password), // Ziffern
    /[^A-Za-z0-9]/.test(password), // Sonderzeichen
  ].filter(Boolean).length;

  return [
    { rule: `Mindestlänge ${minLength} Zeichen`, passed: password.length >= minLength },
    { rule: "Erfüllt mind. 3 von 4 Zeichenkategorien (Groß/Klein/Zahl/Sonderzeichen)", passed: categories >= 3 },
    { rule: "Enthält nicht den Nutzernamen (manuell prüfen)", passed: true },
    { rule: "Keine trivialen Muster (123456, password, qwertz...)", passed: !/^(123456|password|passwort|qwertz|qwerty|admin|letmein)/i.test(password) },
    { rule: "Maximal 2 gleiche Zeichen in Folge", passed: !/(.)\1{2,}/.test(password) },
  ];
}
