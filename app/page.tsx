"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { scanText } from "@/lib/scanner-logic";
import { Shield, CheckCircle, AlertTriangle, TrendingUp, Users, FileText, Zap, ArrowRight, ChevronDown, Euro, XCircle, Clipboard, Search, BarChart3, ShieldCheck, Leaf, Menu, X, Twitter, Linkedin, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { t } = useLanguage();
  const [demoText, setDemoText] = useState("");
  const [demoResult, setDemoResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleDemoScan = () => {
    if (!demoText.trim()) return;
    
    setIsScanning(true);
    setTimeout(() => {
      const result = scanText(demoText);
      setDemoResult(result);
      setIsScanning(false);
    }, 800);
  };

  const scrollToDemo = () => {
    const demoSection = document.getElementById("demo-section");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMobileMenuOpen(false);
  };

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const exampleTexts = [
    "Our product is 100% climate neutral and completely sustainable.",
    "Eco-friendly packaging made from sustainable materials.",
    "Made with 80% recycled materials (certified GRS Standard).",
  ];


  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-sm"
            : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
        } border-b border-gray-200 dark:border-gray-800`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Leaf className="w-7 h-7 text-primary" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Green Claim Check
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("features-section")}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                {t.nav.features}
              </button>
              <button
                onClick={() => scrollToSection("pricing-section")}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                {t.nav.pricing}
              </button>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                {t.nav.docs}
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                {t.nav.blog}
              </a>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
                {t.nav.signIn}
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={scrollToDemo}
                className="bg-primary hover:bg-primary-dark"
              >
                {t.nav.tryFree}
              </Button>
              <LanguageToggle />
              <DarkModeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <DarkModeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4 animate-slide-up">
              <nav className="flex flex-col gap-4">
                <button
                  onClick={() => scrollToSection("features-section")}
                  className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-2"
                >
                  {t.nav.features}
                </button>
                <button
                  onClick={() => scrollToSection("pricing-section")}
                  className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-2"
                >
                  {t.nav.pricing}
                </button>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-2"
                >
                  {t.nav.docs}
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-2"
                >
                  {t.nav.blog}
                </a>
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <button className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-2">
                    {t.nav.signIn}
                  </button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={scrollToDemo}
                    className="w-full bg-primary hover:bg-primary-dark"
                  >
                    {t.nav.tryFree}
                  </Button>
                  <div className="pt-2">
                    <LanguageToggle />
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero text-white py-24 md:py-40 relative overflow-hidden">
        {/* Subtle grid pattern overlay is handled in CSS via ::before */}
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="hero-content-box max-w-5xl mx-auto">
            <div className="rounded-[22px] p-8 md:p-12 lg:p-16">
              <div className="fade-in-up">
                <h1 className="mb-8 md:mb-10 lg:mb-12 text-balance text-white drop-shadow-lg">
                  {t.hero.headline}
                </h1>
              </div>
              
              <div className="fade-in-up-delay-1">
                <p className="text-hero mb-12 md:mb-14 lg:mb-16 text-white/95 max-w-4xl mx-auto text-balance">
                  {t.hero.subheadline}
                </p>
              </div>
              
              <div className="fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <button
                  onClick={scrollToDemo}
                  className="cta-button-glow group relative px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t.hero.cta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
                
                <Link href="/app">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm px-8 py-4 text-lg font-semibold transition-all duration-300"
                  >
                    {t.nav.tryFree}
                  </Button>
                </Link>
              </div>
              
              <div className="fade-in-up-delay-3 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 w-fit mx-auto">
                <CheckCircle className="w-5 h-5 text-white" />
                <span className="text-sm md:text-base font-medium">{t.hero.trustBadge}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 md:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-16 md:mb-20">
            {t.problem.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Statistic 1 */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-600">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-50/30 to-transparent dark:from-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="relative">
                <AlertTriangle className="w-10 h-10 text-danger mx-auto mb-6 opacity-70" />
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4">{t.problem.stat1.value}</div>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  {t.problem.stat1.description}
                  <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {t.problem.stat1.source}
                  </span>
                </p>
              </div>
            </div>

            {/* Statistic 2 */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-600">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-50/30 to-transparent dark:from-amber-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="relative">
                <Euro className="w-10 h-10 text-accent mx-auto mb-6 opacity-70" />
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4">{t.problem.stat2.value}</div>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  {t.problem.stat2.description}
                </p>
              </div>
            </div>

            {/* Statistic 3 */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-600">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="relative">
                <XCircle className="w-10 h-10 text-primary mx-auto mb-6 opacity-70" />
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-4">{t.problem.stat3.value}</div>
                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                  {t.problem.stat3.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works / Features */}
      <section id="features-section" className="py-20 md:py-24 bg-gray-50 dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-16 md:mb-20">
            {t.howItWorks.title}
          </h2>
          
          {/* Timeline - Desktop Horizontal, Mobile Vertical */}
          <div className="max-w-6xl mx-auto">
            {/* Desktop Timeline */}
            <div className="hidden md:block relative">
              {/* Connecting Line */}
              <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary">
                <div className="absolute inset-0 bg-primary/20"></div>
              </div>
              
              <div className="grid grid-cols-4 gap-6 relative">
                {[
                  {
                    icon: Clipboard,
                    title: t.howItWorks.step1.title,
                    description: t.howItWorks.step1.description,
                    emoji: "📝"
                  },
                  {
                    icon: Search,
                    title: t.howItWorks.step2.title,
                    description: t.howItWorks.step2.description,
                    emoji: "🔍"
                  },
                  {
                    icon: BarChart3,
                    title: t.howItWorks.step3.title,
                    description: t.howItWorks.step3.description,
                    emoji: "📊"
                  },
                  {
                    icon: ShieldCheck,
                    title: t.howItWorks.step4.title,
                    description: t.howItWorks.step4.description,
                    emoji: "✅"
                  }
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="relative animate-fade-in-left"
                    style={{ animationDelay: `${idx * 0.15}s` }}
                  >
                    {/* Step Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      {/* Step Number Circle */}
                      <div className="relative mb-6">
                        <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center border-2 border-primary">
                          <step.icon className="w-10 h-10 text-primary" />
                        </div>
                        {/* Step Number Badge */}
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="text-center">
                        <div className="text-3xl mb-3">{step.emoji}</div>
                        <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Timeline - Vertical */}
            <div className="md:hidden space-y-8">
              {[
                {
                  icon: Clipboard,
                  title: t.howItWorks.step1.title,
                  description: t.howItWorks.step1.description,
                  emoji: "📝"
                },
                {
                  icon: Search,
                  title: t.howItWorks.step2.title,
                  description: t.howItWorks.step2.description,
                  emoji: "🔍"
                },
                {
                  icon: BarChart3,
                  title: t.howItWorks.step3.title,
                  description: t.howItWorks.step3.description,
                  emoji: "📊"
                },
                {
                  icon: ShieldCheck,
                  title: t.howItWorks.step4.title,
                  description: t.howItWorks.step4.description,
                  emoji: "✅"
                }
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="relative animate-fade-in-left"
                  style={{ animationDelay: `${idx * 0.15}s` }}
                >
                  {/* Connecting Line (Mobile) */}
                  {idx < 3 && (
                    <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-gradient-to-b from-primary to-primary/30"></div>
                  )}
                  
                  {/* Step Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-start gap-4">
                      {/* Step Number Circle */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center border-2 border-primary">
                          <step.icon className="w-8 h-8 text-primary" />
                        </div>
                        {/* Step Number Badge */}
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="text-2xl mb-2">{step.emoji}</div>
                        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo-section" className="py-16 bg-white dark:bg-gray-800 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12 md:mb-16">
            {t.demo.title}
          </h2>
          <div className="max-w-4xl mx-auto">
            <Card variant="elevated">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.demo.charLimit}
                  </label>
                  <textarea
                    value={demoText}
                    onChange={(e) => {
                      const text = e.target.value.slice(0, 500);
                      setDemoText(text);
                    }}
                    placeholder={t.demo.placeholder}
                    className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  />
                  <div className="text-sm text-gray-500 mt-1 text-right">
                    {demoText.length}/500
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exampleTexts.map((text, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDemoText(text.slice(0, 500))}
                      className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {text.slice(0, 30)}...
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleDemoScan}
                  isLoading={isScanning}
                  className="w-full"
                  disabled={!demoText.trim()}
                >
                  {t.demo.scanNow}
                </Button>
              </div>
            </Card>

            {demoResult && (
              <Card variant="elevated" className="mt-6 animate-slide-up">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{t.demo.results}</h3>
                    <span
                      className={`text-lg font-bold ${
                        demoResult.score >= 70
                          ? "text-danger"
                          : demoResult.score >= 40
                          ? "text-accent"
                          : "text-success"
                      }`}
                    >
                      {t.demo.risk}: {demoResult.score}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-danger font-semibold">{t.demo.critical}: </span>
                      {demoResult.criticalCount}
                    </div>
                    <div>
                      <span className="text-accent font-semibold">{t.demo.warnings}: </span>
                      {demoResult.warningCount}
                    </div>
                    <div>
                      <span className="text-success font-semibold">{t.demo.minor}: </span>
                      {demoResult.minorCount}
                    </div>
                  </div>
                  {demoResult.findings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">{t.demo.flaggedTerms}:</h4>
                      {demoResult.findings.slice(0, 3).map((f: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                        >
                          <span className="font-mono">"{f.term}"</span> - {f.severity}
                        </div>
                      ))}
                    </div>
                  )}
                  <Link href="/app">
                    <Button variant="primary" className="w-full">
                      {t.demo.getFullAnalysis} <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing-section" className="py-20 md:py-24 bg-gray-50 dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12 md:mb-16">
            {t.pricing.title}
          </h2>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isYearly ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
              {t.pricing.monthly}
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-gray-300 rounded-full shadow-md transform transition-transform duration-300 ${
                  isYearly ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isYearly ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>
                {t.pricing.yearly}
              </span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                {t.pricing.save}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                name: t.pricing.free.name,
                monthlyPrice: 0,
                yearlyPrice: 0,
                features: t.pricing.free.features,
                cta: t.pricing.free.cta,
                popular: false,
                highlight: false,
              },
              {
                name: t.pricing.starter.name,
                monthlyPrice: 29,
                yearlyPrice: 23,
                period: "/month",
                features: t.pricing.starter.features,
                cta: t.pricing.starter.cta,
                trialDays: 14,
                popular: false,
                highlight: false,
              },
              {
                name: t.pricing.pro.name,
                monthlyPrice: 99,
                yearlyPrice: 79,
                period: "/month",
                features: t.pricing.pro.features,
                cta: t.pricing.pro.cta,
                trialDays: 14,
                popular: true,
                highlight: true,
                badge: t.pricing.pro.badge,
              },
              {
                name: t.pricing.enterprise.name,
                price: "Custom",
                features: t.pricing.enterprise.features,
                cta: t.pricing.enterprise.cta,
                popular: false,
                highlight: false,
              },
            ].map((plan, idx) => {
              const displayPrice = plan.price === "Custom" 
                ? "Custom" 
                : isYearly 
                  ? `€${plan.yearlyPrice}` 
                  : `€${plan.monthlyPrice}`;
              
              const originalPrice = plan.price === "Custom" 
                ? null 
                : isYearly && plan.monthlyPrice 
                  ? plan.monthlyPrice 
                  : null;

              return (
                <div
                  key={idx}
                  className={`group relative bg-white dark:bg-gray-800 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                    plan.highlight
                      ? "border-primary/60 shadow-md scale-[1.02]"
                      : "border-gray-200 dark:border-gray-700 shadow-sm hover:border-primary/40"
                  }`}
                >
                  {plan.highlight && plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-md">
                      {plan.badge}
                    </div>
                  )}

                  <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h3 className={`text-xl font-bold mb-4 ${plan.highlight ? "text-primary" : "text-gray-900 dark:text-white"}`}>
                        {plan.name}
                      </h3>
                      <div className="mb-2">
                        {plan.price === "Custom" ? (
                          <div className="text-4xl font-bold text-gray-900 dark:text-white">
                            {plan.price}
                          </div>
                        ) : (
                          <div className="flex items-baseline justify-center gap-2">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                              {displayPrice}
                            </span>
                            {plan.period && (
                              <span className="text-lg text-gray-500 dark:text-gray-400">
                                {plan.period}
                              </span>
                            )}
                          </div>
                        )}
                        {originalPrice && (
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                              €{originalPrice}
                            </span>
                            <span className="text-sm text-primary font-semibold">
                              Save {Math.round((1 - (plan.yearlyPrice! / plan.monthlyPrice!)) * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3">
                          <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.highlight ? "text-primary" : "text-success"
                          }`} />
                          <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      variant={plan.highlight ? "primary" : "outline"}
                      className={`w-full ${
                        plan.highlight 
                          ? "bg-primary hover:bg-primary-dark" 
                          : "border-2 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {plan.cta}
                      {plan.trialDays && (
                        <span className="ml-2 text-xs opacity-80">
                          ({plan.trialDays} days)
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-center mb-12 md:mb-16">
            {t.faq.title}
          </h2>
          <div className="space-y-4">
            {t.faq.items.map((faq, idx) => (
              <Card
                key={idx}
                variant="outlined"
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setShowFAQ(showFAQ === idx ? null : idx)}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold flex-1">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                      showFAQ === idx ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {showFAQ === idx && (
                  <p className="mt-4 text-gray-600 dark:text-gray-400 animate-slide-up">
                    {faq.answer}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Product Column */}
            <div>
              <h4 className="font-semibold text-base mb-6 text-white">{t.footer.product}</h4>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => scrollToSection("features-section")}
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group"
                  >
                    Features
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pricing-section")}
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group"
                  >
                    Pricing
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </button>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    API
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    Roadmap
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="font-semibold text-base mb-6 text-white">{t.footer.company}</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    About
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    Blog
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    Careers
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    Contact
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="font-semibold text-base mb-6 text-white">{t.footer.legal}</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    Privacy
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    Terms
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    GDPR
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    Imprint
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Column */}
            <div>
              <h4 className="font-semibold text-base mb-6 text-white">{t.footer.social}</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
