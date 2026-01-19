"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/AppHeader";
import { InputPanel } from "@/components/scanner/InputPanel";
import { ResultsPanel } from "@/components/scanner/ResultsPanel";
import { ScanResults, scanTextNew } from "@/lib/scanner-logic";
import { createSupabaseClient } from "@/lib/supabase/client";
import { saveScan, getUserScans, type ScanRecord } from "@/lib/supabase/scans";
import { getUserSubscription, type UserSubscription } from "@/lib/supabase/subscriptions";
import { getScanLimit, isUnlimited } from "@/lib/subscription-limits";
import { getCurrentUserInfo } from "@/lib/user-utils";
import { toast } from "sonner";

export default function AppPage() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<ScanResults | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [scansUsed, setScansUsed] = useState(0);
  const [scansRemaining, setScansRemaining] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string | null>(null);
  
  // Load cached user info after mount to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("userInfo");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
            setUserName(parsed.userName);
            setUserInitials(parsed.userInitials);
          }
        }
      } catch (error) {
        // Ignore errors
      }
    }
  }, []);

  const handleScanComplete = useCallback(async (scanResults: ScanResults) => {
    setResults(scanResults);
    
    // Save scan to database if user is logged in
    if (userId) {
      try {
        const { error } = await saveScan(userId, scanResults);
        if (error) {
          console.error("Error saving scan:", error);
          // Show more specific error message if available
          const errorMessage = error.message || "Failed to save scan to history";
          toast.error(errorMessage);
        } else {
          toast.success("Scan saved to history");
          
          // Refresh usage data
          const { data: subData } = await getUserSubscription(userId);
          setSubscription(subData);
          
          const plan = (subData?.plan || 'free') as 'free' | 'starter' | 'pro';
          if (isUnlimited(plan)) {
            setScansRemaining(null);
          } else {
            // Use scans_remaining directly from database
            setScansRemaining(subData?.scans_remaining ?? 0);
          }
          setScansUsed(prev => prev + 1);
        }
      } catch (error: any) {
        console.error("Unexpected error saving scan:", error);
        const errorMessage = error?.message || "Failed to save scan to history";
        toast.error(errorMessage);
      }
    }
  }, [userId]);

  // Get current user, subscription, and usage data
  useEffect(() => {
    const loadUserData = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Get user display name and initials (will use cache if available)
        const userInfo = await getCurrentUserInfo();
        setUserName(userInfo.userName);
        setUserInitials(userInfo.userInitials);

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

        // Use scans_remaining directly from database
        if (isUnlimited(plan)) {
          setScansRemaining(null);
        } else {
          // Use scans_remaining directly from database
          setScansRemaining(subData?.scans_remaining ?? 0);
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

    // Check for auto-scan after registration (demo text from landing page)
    const autoScan = urlParams.get('autoScan');
    const demoTextParam = urlParams.get('demoText');
    
    if (autoScan === 'true' && demoTextParam) {
      const decodedDemoText = decodeURIComponent(demoTextParam);
      if (decodedDemoText.trim()) {
        // Set input text
        setInputText(decodedDemoText);
        
        // Auto-scan after a short delay to ensure UI is ready
        setTimeout(async () => {
          try {
            const scanResults = scanTextNew(decodedDemoText);
            setResults(scanResults);
            
            // Save scan to database if user is logged in
            const supabase = createSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              try {
                const { error } = await saveScan(user.id, scanResults);
                if (error) {
                  console.error("Error saving scan:", error);
                  // Don't show error toast for auto-scan, just log it
                } else {
                  toast.success('Willkommen! Ihr Demo-Text wurde automatisch analysiert und gespeichert.');
                }
              } catch (error: any) {
                console.error("Error saving scan:", error);
                // Don't show error toast for auto-scan, just log it
              }
            } else {
              toast.success('Willkommen! Ihr Demo-Text wurde automatisch analysiert.');
            }
          } catch (error) {
            console.error('Error auto-scanning demo text:', error);
            toast.error('Fehler beim automatischen Scan. Bitte versuchen Sie es erneut.');
          }
        }, 500);
        
        // Clean up URL parameters
        window.history.replaceState({}, '', '/app');
        
        // Clean up sessionStorage
        sessionStorage.removeItem('demoTextForScan');
      }
    }
  }, []);

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
        userName={userName || "User"}
        userInitials={userInitials || "U"}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Input (60%) */}
        <div className="w-full lg:w-3/5 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
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
          <div className="container mx-auto px-4 py-8">
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
