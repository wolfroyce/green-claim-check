"use client";

import React from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  FileText
} from "lucide-react";

export default function ReportsPage() {
  const { t } = useLanguage();

  // Placeholder data - will be replaced with real data later
  const hasData = false; // Set to true to see placeholder charts

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900">
      <AppHeader
        activeTab="reports"
        creditsRemaining={97}
        userName="John Doe"
        userInitials="JD"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reports Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View aggregate statistics and compliance trends
          </p>
        </div>

        {!hasData ? (
          <Card variant="elevated" className="shadow-sm">
            <div className="text-center py-16">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start scanning to see trends
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your compliance statistics and trends will appear here once you start scanning content.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aggregate Statistics */}
            <Card variant="elevated" className="shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Aggregate Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-gray-700 dark:text-gray-300">Total Scans</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-gray-700 dark:text-gray-300">Compliant Scans</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-danger" />
                    <span className="text-gray-700 dark:text-gray-300">Issues Found</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">0</span>
                </div>
              </div>
            </Card>

            {/* Most Flagged Terms */}
            <Card variant="elevated" className="shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Most Flagged Terms
              </h2>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  Chart placeholder - will show bar chart of most flagged terms
                </p>
              </div>
            </Card>

            {/* Compliance Score Over Time */}
            <Card variant="elevated" className="shadow-sm lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Compliance Score Over Time
              </h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Graph placeholder - will show line chart of compliance scores
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
