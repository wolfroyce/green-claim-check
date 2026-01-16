"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { InputPanel } from "@/components/scanner/InputPanel";
import { ResultsPanel } from "@/components/scanner/ResultsPanel";
import { ScanResults } from "@/lib/scanner-logic";
import { createSupabaseClient } from "@/lib/supabase/client";
import { saveScan } from "@/lib/supabase/scans";
import { toast } from "sonner";

export default function AppPage() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<ScanResults | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const handleScanComplete = async (scanResults: ScanResults) => {
    setResults(scanResults);
    
    // Save scan to database if user is logged in
    if (userId) {
      try {
        const { error } = await saveScan(userId, scanResults);
        if (error) {
          console.error("Error saving scan:", error);
          toast.error("Failed to save scan to history");
        } else {
          toast.success("Scan saved to history");
        }
      } catch (error) {
        console.error("Unexpected error saving scan:", error);
        toast.error("Failed to save scan to history");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900 flex flex-col"
    >
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
              scanResults={results}
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
    </motion.div>
  );
}
