// Encoding/Decoding-Hilfsfunktionen, alle rein clientseitig

export function base64Encode(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}
export function base64Decode(text: string): string {
  return decodeURIComponent(escape(atob(text)));
}

export function urlEncode(text: string): string {
  return encodeURIComponent(text);
}
export function urlDecode(text: string): string {
  return decodeURIComponent(text);
}

export function htmlEntitiesEncode(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return text.replace(/[&<>"']/g, (c) => map[c]);
}
export function htmlEntitiesDecode(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

export function textToBinary(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((byte) => byte.toString(2).padStart(8, "0"))
    .join(" ");
}
export function binaryToText(binary: string): string {
  const bytes = binary.trim().split(/\s+/).map((b) => parseInt(b, 2));
  if (bytes.some((b) => Number.isNaN(b))) throw new Error("Ungültige Binärdaten");
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export function textToHex(text: string): string {
  return Array.from(new TextEncoder().encode(text))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");
}
export function hexToText(hex: string): string {
  const clean = hex.trim().replace(/\s+/g, "").replace(/0x/gi, "");
  if (clean.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(clean)) throw new Error("Ungültige Hex-Daten");
  const bytes = clean.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) || [];
  return new TextDecoder().decode(new Uint8Array(bytes));
}

const MORSE_MAP: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....",
  I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.",
  Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
  Y: "-.--", Z: "--..", "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  '"': ".-..-.", "$": "...-..-", "@": ".--.-.",
};
const MORSE_MAP_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([k, v]) => [v, k])
);

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split(" ")
    .map((word) =>
      word
        .split("")
        .map((char) => MORSE_MAP[char] ?? "")
        .filter(Boolean)
        .join(" ")
    )
    .join(" / ");
}
export function morseToText(morse: string): string {
  return morse
    .trim()
    .split(" / ")
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => MORSE_MAP_REVERSE[code] ?? "")
        .join("")
    )
    .join(" ");
}

// Zahlensystem-Konverter: Dezimal, Binär, Hex, Oktal
export type NumberBase = "dec" | "bin" | "hex" | "oct";
const BASE_RADIX: Record<NumberBase, number> = { dec: 10, bin: 2, hex: 16, oct: 8 };

export function convertNumberBase(value: string, from: NumberBase): Record<NumberBase, string> {
  const n = parseInt(value, BASE_RADIX[from]);
  if (Number.isNaN(n)) throw new Error("Ungültiger Wert für dieses Zahlensystem");
  return {
    dec: n.toString(10),
    bin: n.toString(2),
    hex: n.toString(16).toUpperCase(),
    oct: n.toString(8),
  };
}
