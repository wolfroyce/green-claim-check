"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLanguage } from "@/contexts/LanguageContext";
import { scanTextNew, ScanResults } from "@/lib/scanner-logic";
import { 
  FileText, 
  Upload, 
  X, 
  ChevronDown,
  Mail,
  MessageSquare,
  Package,
  Globe,
  Loader2,
  CheckCircle
} from "lucide-react";

interface InputPanelProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onScan?: () => void; // Legacy prop for backward compatibility
  isScanning?: boolean; // Legacy prop
  onScanComplete?: (results: ScanResults) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  inputText,
  onInputChange,
  onScan,
  isScanning: externalIsScanning,
  onScanComplete,
}) => {
  const { t } = useLanguage();
  const [showTemplates, setShowTemplates] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const exampleTemplates = [
    {
      name: "Email Campaign",
      icon: Mail,
      text: "Dear customers,\n\nWe're excited to announce our new klimaneutral product line. Our products are 100% umweltfreundlich and made with sustainable materials. Join our green initiative today!",
    },
    {
      name: "Social Media Post",
      icon: MessageSquare,
      text: "🌱 Introducing our eco-friendly new collection! Made from sustainable materials and completely carbon neutral. #green #sustainable",
    },
    {
      name: "Product Description",
      icon: Package,
      text: "This product is klimaneutral and 100% umweltfreundlich. Made with nachhaltig materials and biologisch abbaubar packaging.",
    },
    {
      name: "Website Copy",
      icon: Globe,
      text: "Company X announces its commitment to becoming klimaneutral by 2025. Our products are now vollständig nachhaltig and umweltfreundlich.",
    },
  ];

  const handleTemplateSelect = (templateText: string) => {
    onInputChange(templateText);
    setShowTemplates(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // TODO: Implement file parsing for .txt, .docx, .pdf
    // For now, just show a placeholder message
    console.log("File upload not yet implemented:", file.name);
    
    // Reset input
    event.target.value = "";
  };

  const handleClear = () => {
    onInputChange("");
    setScanSuccess(false);
  };

  const handleScan = async () => {
    if (!inputText.trim() || isScanning) return;

    setIsScanning(true);
    setScanSuccess(false);

    try {
      // Artificial delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Perform scan
      const results = scanTextNew(inputText);

      // Call legacy onScan if provided (for backward compatibility)
      if (onScan) {
        onScan();
      }

      // Call new onScanComplete callback
      if (onScanComplete) {
        onScanComplete(results);
      }

      // Show success animation
      setScanSuccess(true);
      setTimeout(() => setScanSuccess(false), 2000);
    } catch (error) {
      console.error("Error during scan:", error);
    } finally {
      setIsScanning(false);
    }
  };

  // Use external isScanning if provided, otherwise use internal state
  const scanning = externalIsScanning !== undefined ? externalIsScanning : isScanning;

  return (
    <Card variant="elevated" className="shadow-sm">
      <div className="space-y-4">
        {/* Header with Character Counter */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t.app.inputText}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {inputText.length} {t.app.characters}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={t.demo.placeholder}
            className="w-full min-h-[400px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-800 dark:text-white resize-y font-mono text-sm transition-all"
          />
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* File Upload */}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
            <input
              type="file"
              accept=".txt,.docx,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Templates Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <FileText className="w-4 h-4" />
              <span>Templates</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showTemplates && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowTemplates(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                  {exampleTemplates.map((template, idx) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleTemplateSelect(template.text)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left text-sm"
                      >
                        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{template.name}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Clear Button */}
          {inputText && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}

          {/* Scan Button - Prominent, Green */}
          <Button
            onClick={handleScan}
            disabled={!inputText.trim() || scanning}
            className={`ml-auto px-8 py-2.5 text-base font-semibold transition-all ${
              scanning ? "animate-pulse" : ""
            } ${scanSuccess ? "animate-success-flash bg-success" : ""}`}
            variant="primary"
          >
            {scanning ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Scanning...
              </>
            ) : scanSuccess ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Scan Complete
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                {t.app.scanText}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
