"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Settings, 
  User, 
  Mail, 
  CreditCard, 
  Key, 
  Bell,
  Crown,
  ArrowUpRight
} from "lucide-react";

export default function SettingsPage() {
  const { t } = useLanguage();
  const [apiKeys, setApiKeys] = useState<string[]>([]);

  // Placeholder user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    plan: "Free",
  };

  const handleUpgrade = () => {
    // TODO: Implement upgrade flow
    console.log("Upgrade clicked");
  };

  const handleAddApiKey = () => {
    // TODO: Implement API key generation
    console.log("Add API key");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900">
      <AppHeader
        activeTab="settings"
        creditsRemaining={97}
        userName={userData.name}
        userInitials="JD"
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account, subscription, and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Account Info */}
          <Card variant="elevated" className="shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Account Information
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userData.name}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  />
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{userData.email}</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Subscription Plan */}
          <Card variant="elevated" className="shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Subscription Plan
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{userData.plan} Plan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">3 scans/month • Basic features</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={handleUpgrade}
                  className="flex items-center gap-2"
                >
                  Upgrade
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Upgrade to unlock more features:
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Unlimited scans
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    API access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Priority support
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* API Keys */}
          <Card variant="elevated" className="shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  API Keys
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddApiKey}
              >
                Generate New Key
              </Button>
            </div>
            <div className="space-y-3">
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Key className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p>No API keys generated yet</p>
                  <p className="text-sm mt-1">Generate a key to start using the API</p>
                </div>
              ) : (
                apiKeys.map((key, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <code className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {key}
                    </code>
                    <Button variant="ghost" size="sm">
                      Copy
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card variant="elevated" className="shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notification Preferences
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive scan results via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Weekly Reports</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get weekly compliance summaries</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Critical Alerts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Immediate notifications for high-risk findings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
