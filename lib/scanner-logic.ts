import { BannedTerm, getAllTerms } from "./banned-terms";

export interface ScanResult {
  term: string;
  matches: Match[];
  severity: "critical" | "warning" | "minor";
  regulation: string;
  penaltyRange: string;
  description: string;
  alternatives: string[];
}

export interface Match {
  index: number;
  length: number;
  line: number;
  context: string;
}

export interface ScanResponse {
  score: number;
  findings: ScanResult[];
  timestamp: Date;
  totalMatches: number;
  criticalCount: number;
  warningCount: number;
  minorCount: number;
}

const SEVERITY_WEIGHTS = {
  critical: 30,
  warning: 10,
  minor: 3,
};

export function scanText(inputText: string): ScanResponse {
  const allTerms = getAllTerms();
  const findings: ScanResult[] = [];
  const lines = inputText.split("\n");

  // Find line numbers for positions
  function getLineNumber(index: number): number {
    let line = 1;
    let currentIndex = 0;
    for (const lineText of lines) {
      if (currentIndex + lineText.length >= index) {
        return line;
      }
      currentIndex += lineText.length + 1; // +1 for newline
      line++;
    }
    return line;
  }

  // Get context around match
  function getContext(index: number, length: number): string {
    const start = Math.max(0, index - 30);
    const end = Math.min(inputText.length, index + length + 30);
    let context = inputText.substring(start, end);
    if (start > 0) context = "..." + context;
    if (end < inputText.length) context = context + "...";
    return context;
  }

  // Scan for each term
  for (const term of allTerms) {
    const regex = new RegExp(term.regex, "gi");
    const matches: Match[] = [];
    let match;

    while ((match = regex.exec(inputText)) !== null) {
      const line = getLineNumber(match.index);
      matches.push({
        index: match.index,
        length: match[0].length,
        line,
        context: getContext(match.index, match[0].length),
      });
    }

    if (matches.length > 0) {
      findings.push({
        term: term.term,
        matches,
        severity: term.severity,
        regulation: term.regulation,
        penaltyRange: term.penaltyRange,
        description: term.description,
        alternatives: term.alternatives,
      });
    }
  }

  // Calculate risk score
  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const warningCount = findings.filter((f) => f.severity === "warning").length;
  const minorCount = findings.filter((f) => f.severity === "minor").length;

  const totalMatches = findings.reduce((sum, f) => sum + f.matches.length, 0);

  const score = Math.min(
    100,
    criticalCount * SEVERITY_WEIGHTS.critical +
      warningCount * SEVERITY_WEIGHTS.warning +
      minorCount * SEVERITY_WEIGHTS.minor
  );

  return {
    score,
    findings,
    timestamp: new Date(),
    totalMatches,
    criticalCount,
    warningCount,
    minorCount,
  };
}

export function highlightText(
  text: string,
  findings: ScanResult[]
): string {
  let highlighted = text;
  const replacements: Array<{ start: number; end: number; replacement: string }> = [];

  // Collect all replacements
  for (const finding of findings) {
    for (const match of finding.matches) {
      const severityClass =
        finding.severity === "critical"
          ? "bg-red-200 dark:bg-red-900/50"
          : finding.severity === "warning"
          ? "bg-yellow-200 dark:bg-yellow-900/50"
          : "bg-green-200 dark:bg-green-900/50";

      const originalText = text.substring(match.index, match.index + match.length);
      const replacement = `<mark class="${severityClass} px-1 rounded">${originalText}</mark>`;
      
      replacements.push({
        start: match.index,
        end: match.index + match.length,
        replacement,
      });
    }
  }

  // Sort by index descending to avoid offset issues
  replacements.sort((a, b) => b.start - a.start);

  // Apply replacements
  for (const replacement of replacements) {
    highlighted =
      highlighted.substring(0, replacement.start) +
      replacement.replacement +
      highlighted.substring(replacement.end);
  }

  return highlighted;
}
