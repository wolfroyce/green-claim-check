"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { createSupabaseClient } from "@/lib/supabase/client";
import { getUserSubscription, getUserUsageStats } from "@/lib/supabase/subscriptions";
import { getUserScans } from "@/lib/supabase/scans";
import { toast } from "sonner";
import { 
  Settings, 
  CreditCard, 
  Calendar,
  TrendingUp,
  BarChart3,
  Download,
  ExternalLink,
  Crown,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface UsageChartData {
  date: string;
  day: number;
  scans: number;
}

export default function SettingsPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [usageStats, setUsageStats] = useState<{
    totalScansThisMonth: number;
    totalScansLast30Days: number;
    averageRiskScore: number;
    chartData: UsageChartData[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [scansRemaining, setScansRemaining] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const supabase = createSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/auth/login");
          return;
        }

        // Fetch subscription
        const { data: subData, error: subError } = await getUserSubscription(user.id);
        if (subError) {
          console.error("Error fetching subscription:", subError);
        } else {
          setSubscription(subData);
        }

        // Fetch usage stats
        const { data: usageData, error: usageError } = await getUserUsageStats(user.id);
        if (usageError) {
          console.error("Error fetching usage stats:", usageError);
        } else {
          setUsageStats(usageData);
        }

        // Calculate scans remaining based on plan
        if (subData) {
          const plan = subData.plan || 'free';
          const { data: scans } = await getUserScans(user.id);
          
          // Get scans from this month
          const now = new Date();
          const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const monthlyScans = scans?.filter(
            (scan) => new Date(scan.created_at) >= thisMonthStart
          ) || [];

          // Plan limits
          const planLimits: Record<string, number> = {
            free: 3,
            starter: 100,
            pro: Infinity,
          };

          const limit = planLimits[plan] || 3;
          const remaining = limit === Infinity ? null : Math.max(0, limit - monthlyScans.length);
          setScansRemaining(remaining);
        }
      } catch (error) {
        console.error("Error fetching settings data:", error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true);
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Error opening portal:", error);
      toast.error(error.message || "Failed to open billing portal");
      setIsLoadingPortal(false);
    }
  };

  const handleUpgrade = () => {
    router.push("/#pricing-section");
  };

  const plan = subscription?.plan || "free";
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
  const isPaidPlan = plan !== "free";

  const getRenewalDate = () => {
    if (!subscription?.current_period_end) return null;
    return new Date(subscription.current_period_end);
  };

  const renewalDate = getRenewalDate();

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900">
      <AppHeader
        activeTab="settings"
        creditsRemaining={scansRemaining ?? 0}
        userName="User"
        userInitials="U"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account, subscription, and preferences
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Plan - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Plan Section */}
              <Card variant="elevated" className="shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Current Plan
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-gray-900 dark:text-white">
                          {planName} Plan
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {scansRemaining !== null
                            ? `${scansRemaining} scans remaining this month`
                            : "Unlimited scans"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {renewalDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {isPaidPlan
                          ? `Renews on ${renewalDate.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}`
                          : "No active subscription"}
                      </span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    {isPaidPlan ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleManageSubscription}
                        isLoading={isLoadingPortal}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Manage Subscription
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={handleUpgrade}
                      >
                        Upgrade Plan
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Billing Section */}
              {isPaidPlan && (
                <Card variant="elevated" className="shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Billing
                    </h2>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Payment Method
                      </p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        •••• •••• •••• (Update in Stripe Portal)
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Invoices
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        View and download invoices from the Stripe Customer Portal
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManageSubscription}
                        isLoading={isLoadingPortal}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        View Invoices
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Usage Section */}
              <Card variant="elevated" className="shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Usage
                  </h2>
                </div>
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        This Month
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {usageStats?.totalScansThisMonth || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Last 30 Days
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {usageStats?.totalScansLast30Days || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Avg Risk Score
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {usageStats?.averageRiskScore || 0}%
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  {usageStats?.chartData && usageStats.chartData.length > 0 && (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={usageStats.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="day"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                            labelFormatter={(label) => `Day ${label}`}
                            formatter={(value: number) => [`${value} scans`, "Scans"]}
                          />
                          <Bar
                            dataKey="scans"
                            fill="#4A6B5A"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column - Quick Actions */}
            <div className="space-y-6">
              <Card variant="elevated" className="shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/app")}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    New Scan
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/app/history")}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                  {isPaidPlan && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleManageSubscription}
                      isLoading={isLoadingPortal}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing Portal
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
