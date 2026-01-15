"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getScanHistory, ScanHistoryItem } from "@/lib/storage";
import { 
  History, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  FileText,
  Search
} from "lucide-react";

export default function HistoryPage() {
  const { t } = useLanguage();
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const filteredHistory = history.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.result.findings.some((f) =>
      f.term.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-danger";
    if (score >= 40) return "text-accent";
    return "text-success";
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return "High Risk";
    if (score >= 40) return "Medium Risk";
    return "Low Risk";
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
        {filteredHistory.length === 0 ? (
          <Card variant="elevated" className="shadow-sm">
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No scans yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start scanning your marketing content to see your history here.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <Card
                key={item.id}
                variant="elevated"
                className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  // TODO: Navigate to scan details
                  console.log("View scan:", item.id);
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
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
                      {item.text.slice(0, 200)}
                      {item.text.length > 200 && "..."}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${getRiskColor(item.result.score)}`}>
                          {item.result.score}% - {getRiskLabel(item.result.score)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-danger" />
                          {item.result.criticalCount} critical
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          {item.result.warningCount} warnings
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-success" />
                          {item.result.minorCount} minor
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
