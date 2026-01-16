"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { createSupabaseClient } from "@/lib/supabase/client";
import { getUserScans, type ScanRecord } from "@/lib/supabase/scans";
import { toast } from "sonner";
import { 
  History, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  FileText,
  Search,
  Loader2
} from "lucide-react";

export default function HistoryPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user and fetch scans
  useEffect(() => {
    const fetchScans = async () => {
      setIsLoading(true);
      try {
        const supabase = createSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please sign in to view your scan history");
          router.push("/auth/login");
          return;
        }

        setUserId(user.id);
        const { data, error } = await getUserScans(user.id);

        if (error) {
          console.error("Error fetching scans:", error);
          toast.error("Failed to load scan history");
        } else {
          setScans(data || []);
        }
      } catch (error) {
        console.error("Unexpected error fetching scans:", error);
        toast.error("Failed to load scan history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScans();
  }, [router]);

  const filteredScans = scans.filter((scan) =>
    scan.input_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scan.findings.critical.some((f: any) =>
      f.term?.term?.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    scan.findings.warnings.some((f: any) =>
      f.term?.term?.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    scan.findings.minor.some((f: any) =>
      f.term?.term?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getRiskColor = (score: number) => {
    if (score >= 81) return "text-danger";
    if (score >= 61) return "text-orange-500";
    if (score >= 31) return "text-accent";
    return "text-success";
  };

  const getRiskLabel = (score: number) => {
    if (score >= 81) return "Critical Risk";
    if (score >= 61) return "High Risk";
    if (score >= 31) return "Medium Risk";
    return "Low Risk";
  };

  const handleScanClick = (scanId: string) => {
    // TODO: Navigate to scan details page
    router.push(`/app/history/${scanId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900">
      <AppHeader
        activeTab="history"
        creditsRemaining={97}
        userName="John Doe"
        userInitials="JD"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Scan History
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your previous scans
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search scans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* History List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredScans.length === 0 ? (
          <Card variant="elevated" className="shadow-sm">
            <EmptyState
              icon={FileText}
              title="No scans yet"
              description={
                searchQuery
                  ? "No scans match your search. Try a different query."
                  : "Start scanning your marketing content to see your history here."
              }
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredScans.map((scan) => (
              <Card
                key={scan.id}
                variant="elevated"
                className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleScanClick(scan.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(scan.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                      {scan.input_text.slice(0, 100)}
                      {scan.input_text.length > 100 && "..."}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${getRiskColor(scan.risk_score)}`}>
                          {scan.risk_score}% - {getRiskLabel(scan.risk_score)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-danger" />
                          {scan.findings.critical.length} critical
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          {scan.findings.warnings.length} warnings
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-success" />
                          {scan.findings.minor.length} minor
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
