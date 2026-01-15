import { jsPDF } from "jspdf";
import { ScanResponse } from "./scanner-logic";

export function exportToPDF(scanResult: ScanResponse, originalText: string): void {
  // Ensure we're in a browser environment
  if (typeof window === "undefined") {
    console.error("PDF export is only available in the browser");
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(74, 107, 90); // Primary green (damped)
  doc.text("Green Claims Compliance Report", margin, yPos);
  yPos += 15;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generated: ${scanResult.timestamp.toLocaleString()}`,
    margin,
    yPos
  );
  yPos += 15;

  // Risk Score
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Risk Score: ${scanResult.score}%`, margin, yPos);
  yPos += 10;

  // Risk Level
  const riskLevel =
    scanResult.score >= 70
      ? "HIGH RISK"
      : scanResult.score >= 40
      ? "MEDIUM RISK"
      : "LOW RISK";
  const riskColor =
    scanResult.score >= 70
      ? [239, 68, 68]
      : scanResult.score >= 40
      ? [245, 158, 11]
      : [16, 185, 129];

  doc.setFontSize(12);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`Risk Level: ${riskLevel}`, margin, yPos);
  yPos += 15;

  // Summary
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Summary:", margin, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.text(
    `• Critical Issues: ${scanResult.criticalCount}`,
    margin + 5,
    yPos
  );
  yPos += 6;
  doc.text(`• Warnings: ${scanResult.warningCount}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`• Minor Notes: ${scanResult.minorCount}`, margin + 5, yPos);
  yPos += 6;
  doc.text(`• Total Matches: ${scanResult.totalMatches}`, margin + 5, yPos);
  yPos += 15;

  // Findings
  if (scanResult.findings.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Flagged Terms:", margin, yPos);
    yPos += 10;

    for (const finding of scanResult.findings) {
      // Check if we need a new page
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = margin;
      }

      const severityColor =
        finding.severity === "critical"
          ? [239, 68, 68]
          : finding.severity === "warning"
          ? [245, 158, 11]
          : [16, 185, 129];

      doc.setFontSize(11);
      doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
      doc.text(
        `${finding.severity.toUpperCase()}: "${finding.term}"`,
        margin,
        yPos
      );
      yPos += 7;

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      const lines = doc.splitTextToSize(
        `Regulation: ${finding.regulation} | Penalty: ${finding.penaltyRange}`,
        pageWidth - 2 * margin
      );
      doc.text(lines, margin + 5, yPos);
      yPos += lines.length * 5 + 3;

      const descLines = doc.splitTextToSize(
        `Description: ${finding.description}`,
        pageWidth - 2 * margin
      );
      doc.text(descLines, margin + 5, yPos);
      yPos += descLines.length * 5 + 3;

      if (finding.alternatives.length > 0) {
        doc.text("Suggestions:", margin + 5, yPos);
        yPos += 5;
        for (const alt of finding.alternatives.slice(0, 2)) {
          const altLines = doc.splitTextToSize(`• ${alt}`, pageWidth - 2 * margin - 10);
          doc.text(altLines, margin + 10, yPos);
          yPos += altLines.length * 4 + 2;
        }
      }

      yPos += 5;
    }
  }

  // Original Text (on new page if needed)
  if (yPos > pageHeight - 100) {
    doc.addPage();
    yPos = margin;
  } else {
    yPos += 10;
  }

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Original Text:", margin, yPos);
  yPos += 8;

  doc.setFontSize(9);
  const textLines = doc.splitTextToSize(originalText, pageWidth - 2 * margin);
  doc.text(textLines, margin, yPos);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Green Claim Check - EU 2024/825 Compliance Tool`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: "right" }
    );
  }

  doc.save(`green-claims-report-${Date.now()}.pdf`);
}
