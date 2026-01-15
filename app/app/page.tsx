"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { InputPanel } from "@/components/scanner/InputPanel";
import { ResultsPanel } from "@/components/scanner/ResultsPanel";
import { ScanResults } from "@/lib/scanner-logic";

export default function AppPage() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<ScanResults | null>(null);

  const handleScanComplete = (scanResults: ScanResults) => {
    setResults(scanResults);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900 flex flex-col">
      <AppHeader
        activeTab="scanner"
        creditsRemaining={97}
        userName="John Doe"
        userInitials="JD"
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Input (60%) */}
        <div className="w-full lg:w-3/5 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <InputPanel
              inputText={inputText}
              onInputChange={setInputText}
              onScanComplete={handleScanComplete}
            />
          </div>
        </div>

        {/* Right Panel - Results (40%) */}
        <div className="w-full lg:w-2/5 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            <ResultsPanel
              results={results}
              onExportPDF={() => {
                // TODO: Implement PDF export
                console.log("Export PDF", results);
              }}
              onCopySuggestion={(text, index) => {
                navigator.clipboard.writeText(text);
                console.log("Copied suggestion:", text);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
