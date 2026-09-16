import CryptoJS from "crypto-js";

// Hash-Funktionen (rein clientseitig, crypto-js läuft komplett im Browser)
export function hashMD5(input: string): string {
  return CryptoJS.MD5(input).toString();
}
export function hashSHA1(input: string): string {
  return CryptoJS.SHA1(input).toString();
}
export function hashSHA256(input: string): string {
  return CryptoJS.SHA256(input).toString();
}
export function hashSHA512(input: string): string {
  return CryptoJS.SHA512(input).toString();
}

export function generateAllHashes(input: string) {
  return {
    MD5: hashMD5(input),
    "SHA-1": hashSHA1(input),
    "SHA-256": hashSHA256(input),
    "SHA-512": hashSHA512(input),
  };
}

// Hash-Typ anhand von Länge und Zeichensatz grob erkennen (keine Garantie,
// da mehrere Algorithmen die gleiche Länge haben können)
export interface HashGuess {
  name: string;
  confidence: string;
}

export function identifyHash(hash: string): HashGuess[] {
  const clean = hash.trim();
  const guesses: HashGuess[] = [];

  if (!/^[a-fA-F0-9]+$/.test(clean)) {
    if (/^[a-zA-Z0-9+/]+=*$/.test(clean) && clean.length % 4 === 0) {
      guesses.push({ name: "Base64-kodierter Hash (Länge deutet auf Bcrypt/Base64-Hash hin)", confidence: "niedrig" });
    }
    if (/^\$2[aby]?\$/.test(clean)) {
      guesses.push({ name: "bcrypt", confidence: "hoch" });
    }
    if (/^\$1\$/.test(clean)) guesses.push({ name: "MD5 crypt (Unix)", confidence: "hoch" });
    if (/^\$6\$/.test(clean)) guesses.push({ name: "SHA-512 crypt (Unix)", confidence: "hoch" });
    if (guesses.length === 0) guesses.push({ name: "Unbekanntes Format (kein reines Hex)", confidence: "niedrig" });
    return guesses;
  }

  const byLength: Record<number, HashGuess[]> = {
    32: [{ name: "MD5", confidence: "hoch" }, { name: "NTLM", confidence: "mittel" }],
    40: [{ name: "SHA-1", confidence: "hoch" }],
    56: [{ name: "SHA-224", confidence: "mittel" }],
    64: [{ name: "SHA-256", confidence: "hoch" }],
    96: [{ name: "SHA-384", confidence: "mittel" }],
    128: [{ name: "SHA-512", confidence: "hoch" }],
  };

  return byLength[clean.length] || [{ name: `Unbekannt (Länge ${clean.length} Hex-Zeichen)`, confidence: "niedrig" }];
}

// HMAC mit Schlüssel
export function generateHMAC(message: string, secret: string, algo: "SHA1" | "SHA256" | "SHA512") {
  if (algo === "SHA1") return CryptoJS.HmacSHA1(message, secret).toString();
  if (algo === "SHA512") return CryptoJS.HmacSHA512(message, secret).toString();
  return CryptoJS.HmacSHA256(message, secret).toString();
}

// Caesar-Chiffre: verschiebt Buchstaben um `shift` Positionen im Alphabet
export function caesarCipher(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= "Z" ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + s) % 26) + base);
  });
}

export function rot13(text: string): string {
  return caesarCipher(text, 13);
}

// Vigenère-Chiffre mit Schlüsselwort
export function vigenere(text: string, key: string, decrypt = false): string {
  const cleanKey = key.replace(/[^a-zA-Z]/g, "");
  if (!cleanKey) return text;
  let keyIndex = 0;
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= "Z" ? 65 : 97;
    const keyChar = cleanKey[keyIndex % cleanKey.length].toUpperCase();
    const shift = keyChar.charCodeAt(0) - 65;
    keyIndex++;
    const effectiveShift = decrypt ? -shift : shift;
    return String.fromCharCode(((char.charCodeAt(0) - base + effectiveShift + 26) % 26) + base);
  });
}

// AES-Verschlüsselung mit Passphrase (CBC, zufälliges Salt/IV via crypto-js Defaults)
export function aesEncrypt(plainText: string, passphrase: string): string {
  return CryptoJS.AES.encrypt(plainText, passphrase).toString();
}

export function aesDecrypt(cipherText: string, passphrase: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
  const result = bytes.toString(CryptoJS.enc.Utf8);
  if (!result) throw new Error("Entschlüsselung fehlgeschlagen – falsche Passphrase oder ungültiger Ciphertext");
  return result;
}
