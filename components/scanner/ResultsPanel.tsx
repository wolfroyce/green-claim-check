"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScanResponse } from "@/lib/scanner-logic";
import { 
  Search, 
  Download, 
  Share2, 
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle
} from "lucide-react";

interface ResultsPanelProps {
  scanResult?: ScanResponse | null;
  onExportPDF?: () => void;
  onCopySuggestion?: (text: string, index: number) => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  scanResult = null,
  onExportPDF,
  onCopySuggestion,
}) => {
  const { t } = useLanguage();
  const [expandedFindings, setExpandedFindings] = useState<Set<number>>(new Set());

  const toggleFinding = (index: number) => {
    const newExpanded = new Set(expandedFindings);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFindings(newExpanded);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { label: "Critical", color: "text-danger", bgColor: "bg-danger", barColor: "bg-danger" };
    if (score >= 60) return { label: "High", color: "text-danger", bgColor: "bg-danger", barColor: "bg-danger" };
    if (score >= 40) return { label: "Medium", color: "text-accent", bgColor: "bg-accent", barColor: "bg-accent" };
    if (score >= 20) return { label: "Low", color: "text-success", bgColor: "bg-success", barColor: "bg-success" };
    return { label: "Very Low", color: "text-success", bgColor: "bg-success", barColor: "bg-success" };
  };

  const getSeverityConfig = (severity: "critical" | "warning" | "minor") => {
    switch (severity) {
      case "critical":
        return {
          icon: AlertCircle,
          label: "Critical",
          color: "text-danger",
          bg: "bg-red-50 dark:bg-red-900/10",
          border: "border-danger/40",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          label: "Warning",
          color: "text-accent",
          bg: "bg-amber-50 dark:bg-amber-900/10",
          border: "border-accent/40",
        };
      case "minor":
        return {
          icon: Info,
          label: "Minor",
          color: "text-success",
          bg: "bg-green-50 dark:bg-green-900/10",
          border: "border-success/40",
        };
    }
  };

  const groupFindingsBySeverity = (findings: ScanResponse["findings"]) => {
    const grouped = {
      critical: [] as ScanResponse["findings"],
      warning: [] as ScanResponse["findings"],
      minor: [] as ScanResponse["findings"],
    };
    findings.forEach((finding) => {
      grouped[finding.severity].push(finding);
    });
    return grouped;
  };

  // Empty State
  if (!scanResult) {
    return (
      <Card variant="elevated" className="shadow-sm h-full flex items-center justify-center min-h-[500px]">
        <div className="text-center px-6 py-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 dark:bg-primary/20 animate-pulse"></div>
            </div>
            <Search className="w-16 h-16 mx-auto text-primary relative z-10" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Ready to Scan
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            Paste your text and click Scan to begin analyzing your marketing content for compliance.
          </p>
        </div>
      </Card>
    );
  }

  const riskLevel = getRiskLevel(scanResult.score);
  const groupedFindings = groupFindingsBySeverity(scanResult.findings);

  return (
    <div className="space-y-4">
      {/* Risk Level Card */}
      <Card variant="elevated" className="shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Risk Level
            </h3>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${riskLevel.bgColor} text-white`}>
              {riskLevel.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${riskLevel.color}`}>
                {scanResult.score}
              </span>
              <span className="text-2xl text-gray-500 dark:text-gray-400">/100</span>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${riskLevel.barColor} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${Math.min(100, scanResult.score)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Findings List */}
      <Card variant="elevated" className="shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Findings
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {scanResult.findings.length} {scanResult.findings.length === 1 ? "issue" : "issues"}
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {/* Critical Findings */}
            {groupedFindings.critical.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-danger flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Critical ({groupedFindings.critical.length})
                </h4>
                {groupedFindings.critical.map((finding, idx) => {
                  const globalIdx = scanResult.findings.indexOf(finding);
                  const isExpanded = expandedFindings.has(globalIdx);
                  const config = getSeverityConfig(finding.severity);
                  const Icon = config.icon;

                  return (
                    <div
                      key={globalIdx}
                      className={`border rounded-lg ${config.border} ${config.bg} transition-all`}
                    >
                      <button
                        onClick={() => toggleFinding(globalIdx)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Icon className={`w-5 h-5 ${config.color} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {finding.term}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {finding.matches.length > 0 && `Line ${finding.matches[0].line}`}
                              {finding.matches.length > 1 && ` (+${finding.matches.length - 1} more)`}
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                          <div className="space-y-3 pt-4">
                            <div>
                              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Description
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {finding.description}
                              </p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Regulation
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {finding.regulation}
                              </p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Penalty Range
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {finding.penaltyRange}
                              </p>
                            </div>
                            {finding.alternatives && finding.alternatives.length > 0 && (
                              <div>
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                  Alternative Suggestions
                                </div>
                                <div className="space-y-1">
                                  {finding.alternatives.map((alt, altIdx) => (
                                    <button
                                      key={altIdx}
                                      onClick={() => onCopySuggestion?.(alt, globalIdx)}
                                      className="block w-full text-left text-sm text-primary hover:text-primary-dark transition-colors"
                                    >
                                      • {alt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Warning Findings */}
            {groupedFindings.warning.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-accent flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Warnings ({groupedFindings.warning.length})
                </h4>
                {groupedFindings.warning.map((finding, idx) => {
                  const globalIdx = scanResult.findings.indexOf(finding);
                  const isExpanded = expandedFindings.has(globalIdx);
                  const config = getSeverityConfig(finding.severity);
                  const Icon = config.icon;

                  return (
                    <div
                      key={globalIdx}
                      className={`border rounded-lg ${config.border} ${config.bg} transition-all`}
                    >
                      <button
                        onClick={() => toggleFinding(globalIdx)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Icon className={`w-5 h-5 ${config.color} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {finding.term}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {finding.matches.length > 0 && `Line ${finding.matches[0].line}`}
                              {finding.matches.length > 1 && ` (+${finding.matches.length - 1} more)`}
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                          <div className="space-y-3 pt-4">
                            <div>
                              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Description
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {finding.description}
                              </p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Regulation
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {finding.regulation}
                              </p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Penalty Range
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {finding.penaltyRange}
                              </p>
                            </div>
                            {finding.alternatives && finding.alternatives.length > 0 && (
                              <div>
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                  Alternative Suggestions
                                </div>
                                <div className="space-y-1">
                                  {finding.alternatives.map((alt, altIdx) => (
                                    <button
                                      key={altIdx}
                                      onClick={() => onCopySuggestion?.(alt, globalIdx)}
                                      className="block w-full text-left text-sm text-primary hover:text-primary-dark transition-colors"
                                    >
                                      • {alt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Minor Findings */}
            {groupedFindings.minor.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-success flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Minor ({groupedFindings.minor.length})
                </h4>
                {groupedFindings.minor.map((finding, idx) => {
                  const globalIdx = scanResult.findings.indexOf(finding);
                  const isExpanded = expandedFindings.has(globalIdx);
                  const config = getSeverityConfig(finding.severity);
                  const Icon = config.icon;

                  return (
                    <div
                      key={globalIdx}
                      className={`border rounded-lg ${config.border} ${config.bg} transition-all`}
                    >
                      <button
                        onClick={() => toggleFinding(globalIdx)}
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Icon className={`w-5 h-5 ${config.color} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">
                              {finding.term}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {finding.matches.length > 0 && `Line ${finding.matches[0].line}`}
                              {finding.matches.length > 1 && ` (+${finding.matches.length - 1} more)`}
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                          <div className="space-y-3 pt-4">
                            <div>
                              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Description
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {finding.description}
                              </p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Regulation
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {finding.regulation}
                              </p>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Penalty Range
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {finding.penaltyRange}
                              </p>
                            </div>
                            {finding.alternatives && finding.alternatives.length > 0 && (
                              <div>
                                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                  Alternative Suggestions
                                </div>
                                <div className="space-y-1">
                                  {finding.alternatives.map((alt, altIdx) => (
                                    <button
                                      key={altIdx}
                                      onClick={() => onCopySuggestion?.(alt, globalIdx)}
                                      className="block w-full text-left text-sm text-primary hover:text-primary-dark transition-colors"
                                    >
                                      • {alt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Findings */}
            {scanResult.findings.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
                <p className="font-medium">No issues found!</p>
                <p className="text-sm mt-1">Your content appears to be compliant.</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <Card variant="elevated" className="shadow-sm">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Actions
          </h3>
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => {
                if (onExportPDF) {
                  onExportPDF();
                } else {
                  console.log("Download PDF Report");
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF Report
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => {
                // TODO: Implement share functionality
                console.log("Share with Team");
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share with Team
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => {
                // TODO: Implement scheduling
                console.log("Schedule Legal Review");
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Legal Review
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
