// Einfacher zeilenbasierter Diff via Longest Common Subsequence (LCS)

export type DiffLineType = "equal" | "added" | "removed";
export interface DiffLine {
  type: DiffLineType;
  text: string;
}

export function diffLines(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const n = linesA.length;
  const m = linesB.length;

  // LCS-Tabelle
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] = linesA[i] === linesB[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (linesA[i] === linesB[j]) {
      result.push({ type: "equal", text: linesA[i] });
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      result.push({ type: "removed", text: linesA[i] });
      i++;
    } else {
      result.push({ type: "added", text: linesB[j] });
      j++;
    }
  }
  while (i < n) {
    result.push({ type: "removed", text: linesA[i] });
    i++;
  }
  while (j < m) {
    result.push({ type: "added", text: linesB[j] });
    j++;
  }

  return result;
}
