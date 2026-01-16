"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { InputPanel } from "@/components/scanner/InputPanel";
import { ResultsPanel } from "@/components/scanner/ResultsPanel";
import { ScanResults } from "@/lib/scanner-logic";
import { createSupabaseClient } from "@/lib/supabase/client";
import { saveScan, getUserScans, type ScanRecord } from "@/lib/supabase/scans";
import { getUserSubscription, type UserSubscription } from "@/lib/supabase/subscriptions";
import { getScanLimit, isUnlimited } from "@/lib/subscription-limits";
import { toast } from "sonner";

export default function AppPage() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<ScanResults | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [scansUsed, setScansUsed] = useState(0);
  const [scansRemaining, setScansRemaining] = useState<number | null>(null);

  // Get current user, subscription, and usage data
  useEffect(() => {
    const loadUserData = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

        // Load subscription
        const { data: subData } = await getUserSubscription(user.id);
        setSubscription(subData);

        // Calculate usage
        const plan = (subData?.plan || 'free') as 'free' | 'starter' | 'pro';
        
        // Get scans from this month
        const { data: scans } = await getUserScans(user.id);
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyScans = (scans || []).filter(
          (scan: ScanRecord) => new Date(scan.created_at) >= thisMonthStart
        );

        setScansUsed(monthlyScans.length);

        // Calculate remaining scans
        if (isUnlimited(plan)) {
          setScansRemaining(null);
        } else {
          const limit = getScanLimit(plan);
          const remaining = subData?.scans_remaining ?? (limit - monthlyScans.length);
          setScansRemaining(Math.max(0, remaining));
        }
      }
    };

    loadUserData();

    // Check for Stripe checkout success
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      toast.success('Subscription activated successfully!');
      // Clean up URL and reload data
      window.history.replaceState({}, '', '/app');
      loadUserData();
    }
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
          
          // Refresh usage data
          const { data: subData } = await getUserSubscription(userId);
          setSubscription(subData);
          
          const plan = (subData?.plan || 'free') as 'free' | 'starter' | 'pro';
          if (!isUnlimited(plan)) {
            setScansRemaining(subData?.scans_remaining ?? 0);
          }
          setScansUsed(prev => prev + 1);
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
        creditsRemaining={scansRemaining}
        scansUsed={scansUsed}
        plan={subscription?.plan || "free"}
        userName="User"
        userInitials="U"
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
