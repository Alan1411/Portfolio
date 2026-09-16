import yaml from "js-yaml";

export function formatJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, 2);
}
export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

export function validateXml(input: string): void {
  const doc = new DOMParser().parseFromString(input, "application/xml");
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) throw new Error(errorNode.textContent || "Ungültiges XML");
}

// Einfacher XML-Pretty-Printer: fügt Zeilenumbrüche zwischen Tags ein und rückt anhand der Verschachtelungstiefe ein
export function formatXml(input: string): string {
  validateXml(input);
  const withBreaks = input.replace(/>\s*</g, ">\n<").trim();
  const lines = withBreaks.split("\n");
  let depth = 0;
  const indented = lines.map((line) => {
    const trimmed = line.trim();
    const isClosing = /^<\//.test(trimmed);
    const isSelfClosing = /\/>$/.test(trimmed) || /^<\?/.test(trimmed) || /^<!--/.test(trimmed);
    const isOpeningOnly = /^<[^/!?][^>]*[^/]>$/.test(trimmed) && !/<\/[^>]+>$/.test(trimmed);

    if (isClosing) depth = Math.max(0, depth - 1);
    const line2 = "  ".repeat(depth) + trimmed;
    if (isOpeningOnly && !isSelfClosing) depth++;
    return line2;
  });
  return indented.join("\n");
}

export function parseYaml(input: string): unknown {
  return yaml.load(input);
}
export function formatYaml(input: string): string {
  const parsed = yaml.load(input);
  return yaml.dump(parsed, { indent: 2, lineWidth: -1 });
}
export function yamlToJson(input: string): string {
  return JSON.stringify(yaml.load(input), null, 2);
}
