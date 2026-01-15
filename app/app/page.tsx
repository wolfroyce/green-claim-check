"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { RiskMeter } from "@/components/scanner/RiskMeter";
import { ResultCard } from "@/components/scanner/ResultCard";
import { scanText, ScanResponse } from "@/lib/scanner-logic";
import { exportToPDF } from "@/lib/pdf-export";
import { saveScanToHistory, getScanHistory, ScanHistoryItem, deleteScanFromHistory } from "@/lib/storage";
import { debounce } from "@/lib/utils";
import { 
  Shield, 
  FileText, 
  Download, 
  History, 
  X, 
  Copy, 
  Check,
  CheckCircle,
  Home,
  Trash2,
  Search
} from "lucide-react";
import Link from "next/link";

export default function AppPage() {
  const [inputText, setInputText] = useState("");
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load history on mount
  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  // Debounced real-time scanning
  const debouncedScan = useCallback(
    debounce((text: string) => {
      if (text.trim().length > 10) {
        const result = scanText(text);
        setScanResult(result);
        
        // Highlight text using match positions
        const replacements: Array<{ start: number; end: number; replacement: string }> = [];
        
        result.findings.forEach((finding) => {
          finding.matches.forEach((match) => {
            const severityClass =
              finding.severity === "critical"
                ? "bg-red-200 dark:bg-red-900/50"
                : finding.severity === "warning"
                ? "bg-yellow-200 dark:bg-yellow-900/50"
                : "bg-green-200 dark:bg-green-900/50";
            
            const originalText = text.substring(match.index, match.index + match.length);
            // Escape HTML in the matched text
            const escapedText = originalText
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
            
            const replacement = `<mark class="${severityClass} px-1 rounded font-semibold">${escapedText}</mark>`;
            
            replacements.push({
              start: match.index,
              end: match.index + match.length,
              replacement,
            });
          });
        });
        
        // Sort by index descending to avoid offset issues
        replacements.sort((a, b) => b.start - a.start);
        
        // Apply replacements
        let highlighted = text;
        for (const replacement of replacements) {
          highlighted =
            highlighted.substring(0, replacement.start) +
            replacement.replacement +
            highlighted.substring(replacement.end);
        }
        
        // Escape remaining HTML and convert newlines
        highlighted = highlighted
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>");
        
        // Restore mark tags (they were escaped above)
        highlighted = highlighted
          .replace(/&lt;mark/g, "<mark")
          .replace(/mark&gt;/g, "mark>");
        
        setHighlightedText(highlighted);
      } else {
        setScanResult(null);
        setHighlightedText("");
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (inputText) {
      debouncedScan(inputText);
    } else {
      setScanResult(null);
      setHighlightedText("");
    }
  }, [inputText, debouncedScan]);

  const handleScan = () => {
    if (!inputText.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      const result = scanText(inputText);
      setScanResult(result);
      saveScanToHistory(inputText, result);
      setHistory(getScanHistory());
      setIsScanning(false);
    }, 800);
  };

  const handleExportPDF = () => {
    if (!scanResult) return;
    exportToPDF(scanResult, inputText);
  };

  const handleCopySuggestion = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleLoadHistoryItem = (item: ScanHistoryItem) => {
    setInputText(item.text);
    setScanResult(item.result);
    setShowHistory(false);
  };

  const handleDeleteHistoryItem = (id: string) => {
    deleteScanFromHistory(id);
    setHistory(getScanHistory());
  };

  const filteredHistory = history.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.result.findings.some((f) =>
      f.term.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const exampleTemplates = [
    {
      name: "Email Campaign",
      text: "Dear customers,\n\nWe're excited to announce our new klimaneutral product line. Our products are 100% umweltfreundlich and made with sustainable materials. Join our green initiative today!",
    },
    {
      name: "Social Media Post",
      text: "🌱 Introducing our eco-friendly new collection! Made from sustainable materials and completely carbon neutral. #green #sustainable",
    },
    {
      name: "Product Description",
      text: "This product is klimaneutral and 100% umweltfreundlich. Made with nachhaltig materials and biologisch abbaubar packaging.",
    },
    {
      name: "Press Release",
      text: "Company X announces its commitment to becoming klimaneutral by 2025. Our products are now vollständig nachhaltig and umweltfreundlich.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-lg font-serif font-semibold">Green Claims Validator</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4 mr-2" />
              History ({history.length})
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* History Sidebar */}
      {showHistory && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowHistory(false)}>
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="mb-0">Scan History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="p-4 space-y-3">
              {filteredHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No scan history found</p>
              ) : (
                filteredHistory.map((item) => (
                  <Card
                    key={item.id}
                    variant="outlined"
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleLoadHistoryItem(item)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              item.result.score >= 70
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : item.result.score >= 40
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {item.result.score}% Risk
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {item.text.slice(0, 100)}...
                        </p>
                        <div className="flex gap-2 mt-2 text-xs text-gray-500">
                          <span>🔴 {item.result.criticalCount}</span>
                          <span>🟡 {item.result.warningCount}</span>
                          <span>🟢 {item.result.minorCount}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteHistoryItem(item.id);
                        }}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-4">
            <Card variant="elevated">
              <div className="flex items-center justify-between mb-4">
                <h2 className="mb-4">Input Text</h2>
                <div className="text-sm text-gray-500">
                  {inputText.length} characters
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your marketing text here... The scanner will analyze it in real-time."
                    className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Templates:</span>
                  {exampleTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(template.text)}
                      className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleScan}
                  isLoading={isScanning}
                  className="w-full"
                  disabled={!inputText.trim()}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Scan Text
                </Button>
              </div>
            </Card>

            {/* Highlighted Text Preview */}
            {highlightedText && (
              <Card variant="outlined">
                <h3 className="mb-4">Highlighted Text</h3>
                <div
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-64 overflow-y-auto font-mono text-sm"
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
              </Card>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-4">
            {scanResult ? (
              <>
                <Card variant="elevated">
                  <RiskMeter
                    score={scanResult.score}
                    criticalCount={scanResult.criticalCount}
                    warningCount={scanResult.warningCount}
                    minorCount={scanResult.minorCount}
                  />
                </Card>

                <div className="flex gap-2">
                  <Button
                    onClick={handleExportPDF}
                    variant="secondary"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(scanResult, null, 2)
                      );
                    }}
                    variant="outline"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <Card variant="elevated">
                  <h3 className="mb-6">
                    Flagged Terms ({scanResult.findings.length})
                  </h3>
                  {scanResult.findings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                      <p>No issues found! Your text appears compliant.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {scanResult.findings.map((finding, idx) => (
                        <ResultCard
                          key={idx}
                          finding={finding}
                          onCopySuggestion={(text) => handleCopySuggestion(text, idx)}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <Card variant="elevated" className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-3">No scan results yet</p>
                  <p className="text-sm">
                    Enter your marketing text on the left to start scanning
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
