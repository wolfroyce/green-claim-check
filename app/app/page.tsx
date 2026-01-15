"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { scanText, ScanResponse } from "@/lib/scanner-logic";
import { exportToPDF } from "@/lib/pdf-export";
import { saveScanToHistory, getScanHistory, ScanHistoryItem, deleteScanFromHistory } from "@/lib/storage";
import { debounce } from "@/lib/utils";
import { AppHeader } from "@/components/AppHeader";
import { InputPanel } from "@/components/scanner/InputPanel";
import { ResultsPanel } from "@/components/scanner/ResultsPanel";
import { 
  X, 
  Trash2,
  Search
} from "lucide-react";

export default function AppPage() {
  const { t } = useLanguage();
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


  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900">
      {/* Header */}
      <AppHeader
        activeTab="scanner"
        creditsRemaining={97}
        userName="John Doe"
        userInitials="JD"
      />

      {/* History Sidebar */}
      {showHistory && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowHistory(false)}>
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="mb-0">{t.app.history}</h2>
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
                  placeholder={t.app.searchHistory}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="p-4 space-y-3">
              {filteredHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{t.app.noHistory}</p>
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

      {/* Main Content - Dashboard Layout */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
          {/* Left Panel - Input (60%) */}
          <div>
            <InputPanel
              inputText={inputText}
              onInputChange={setInputText}
              onScan={handleScan}
              isScanning={isScanning}
            />

            {/* Highlighted Text Preview */}
            {highlightedText && (
              <Card variant="outlined" className="mt-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  {t.app.highlightedText}
                </h3>
                <div
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-64 overflow-y-auto font-mono text-sm border border-gray-200 dark:border-gray-700"
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
              </Card>
            )}
          </div>

          {/* Right Panel - Results (40%) */}
          <div>
            <ResultsPanel
              scanResult={scanResult}
              onExportPDF={handleExportPDF}
              onCopySuggestion={handleCopySuggestion}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
