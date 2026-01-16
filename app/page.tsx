"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { scanText } from "@/lib/scanner-logic";
import { Shield, CheckCircle, AlertTriangle, TrendingUp, Users, FileText, Zap, ArrowRight, ChevronDown, Euro, XCircle, Clipboard, Search, BarChart3, ShieldCheck, Leaf, Menu, X, Twitter, Linkedin, Github, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [demoText, setDemoText] = useState("");
  const [demoResult, setDemoResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);
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
    // Demo is now in hero section, just scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
              >
                {t.nav.pricing}
              </Link>
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
                <Link
                  href="/pricing"
                  className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors py-2 block"
                >
                  {t.nav.pricing}
                </Link>
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
      <section className="gradient-hero text-white py-16 md:py-24 relative overflow-hidden">
        {/* Subtle grid pattern overlay is handled in CSS via ::before */}
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Badge oben */}
          <div className="text-center mb-6 fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs md:text-sm font-medium text-white/90">
              <CheckCircle className="w-4 h-4 text-white" />
              <span>{t.hero.trustBadge || "Basierend auf EU-Richtlinie 2024/825"}</span>
            </div>
          </div>

          {/* Hero Headline & Subheadline */}
          <div className="text-center mb-8 md:mb-10 max-w-4xl mx-auto">
            <div className="fade-in-up">
              <h1 className="mb-6 md:mb-8 text-4xl md:text-5xl lg:text-6xl font-bold text-balance text-white drop-shadow-lg leading-tight">
                Vermeiden Sie Bußgelder bis zu €40.000<br />
                für Greenwashing-Verstöße
              </h1>
            </div>
            
            <div className="fade-in-up-delay-1">
              <p className="text-lg md:text-xl text-white/95 max-w-3xl mx-auto text-balance mb-8 leading-relaxed">
                Prüfen Sie Ihre Marketing-Aussagen automatisch auf EU-Compliance – in Sekunden, nicht Stunden.
              </p>
            </div>
          </div>

          {/* Primary CTA mit Trust Signals */}
          <div className="flex flex-col items-center gap-4 mb-8 fade-in-up-delay-2">
            <Link href="/app" className="w-full max-w-md">
              <Button
                variant="primary"
                size="lg"
                className="w-full py-5 px-8 text-lg md:text-xl font-bold shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300"
              >
                {t.hero.cta || "Jetzt kostenlos prüfen"}
                <ArrowRight className="w-6 h-6 ml-3 inline" />
              </Button>
            </Link>
            <div className="flex items-center gap-4 text-sm text-white/80 flex-wrap justify-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Keine Anmeldung nötig</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Ergebnis in 30 Sekunden</span>
              </div>
            </div>
            <Link href="#features-section" className="text-sm text-white/80 hover:text-white transition-colors underline underline-offset-4">
              Wie es funktioniert →
            </Link>
          </div>

          {/* Social Proof */}
          <div className="text-center mb-10 md:mb-12 fade-in-up-delay-3">
            <p className="text-sm md:text-base text-white/80 mb-2">
              {t.hero.socialProof || "💬 Vertraut von 500+ Marketing-Teams in der EU"}
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xs font-bold text-white"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-white/90 ml-2">⭐⭐⭐⭐⭐ 4.8/5</span>
            </div>
          </div>

          {/* Prominent Interactive Demo */}
          <div className="max-w-5xl mx-auto fade-in-up-delay-4">
            <Card variant="elevated" className="bg-white dark:bg-gray-800 shadow-2xl border-2 border-primary/20">
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
                  Live-Demo: Testen Sie jetzt
                </h2>
                <div className="mb-4">
                  <textarea
                    value={demoText}
                    onChange={(e) => {
                      const text = e.target.value.slice(0, 250);
                      setDemoText(text);
                    }}
                    placeholder={t.demo.placeholder || "Unser Produkt ist 100% klimaneutral und aus recycelten Materialien hergestellt..."}
                    className="w-full h-40 md:h-48 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white resize-none text-gray-900 text-base shadow-inner transition-all duration-200"
                  />
                  {/* Zeichenlimit NICHT anzeigen - nur intern limitiert */}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  <span className="text-xs text-gray-500 mr-2">💡 Beispiele probieren:</span>
                  {exampleTexts.map((text, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDemoText(text.slice(0, 250))}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                    >
                      {text.slice(0, 30)}...
                    </button>
                  ))}
                </div>
                
                <Button
                  onClick={handleDemoScan}
                  isLoading={isScanning}
                  className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  disabled={!demoText.trim()}
                  variant="primary"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Scanne...
                    </>
                  ) : (
                    <>
                      Compliance prüfen →
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Demo Result - Smart Popup mit Teaser und Nudge zur Anmeldung */}
            {demoResult && (
              <Card variant="elevated" className="mt-6 animate-slide-up bg-white dark:bg-gray-800 shadow-2xl border-2 border-primary/20 relative overflow-hidden">
                <div className="p-6 md:p-8 space-y-4">
                  <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="w-6 h-6 text-success" />
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Ihr Scan ist fertig!</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Hier ist eine Vorschau Ihrer Ergebnisse
                    </p>
                  </div>

                  <div className="flex items-center justify-between bg-gradient-to-r from-danger/10 via-accent/10 to-success/10 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Risiko-Score</p>
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-3xl font-bold ${
                            demoResult.score >= 70
                              ? "text-danger"
                              : demoResult.score >= 40
                              ? "text-accent"
                              : "text-success"
                          }`}
                        >
                          {demoResult.score}%
                        </span>
                        <span className={`text-sm font-semibold ${
                          demoResult.score >= 70 ? "text-danger" : demoResult.score >= 40 ? "text-accent" : "text-success"
                        }`}>
                          {demoResult.score >= 70 ? "(Hoch)" : demoResult.score >= 40 ? "(Mittel)" : "(Niedrig)"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Potenzielle Verstöße</p>
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {demoResult.criticalCount + demoResult.warningCount + demoResult.minorCount}
                      </span>
                    </div>
                  </div>

                  {/* Blurred Details - Nudge zur Anmeldung */}
                  <div className="relative">
                    <div className="blur-sm select-none pointer-events-none opacity-60">
                      <div className="grid grid-cols-3 gap-4 text-center mb-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <span className="text-danger font-bold text-lg">{demoResult.criticalCount}</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t.demo.critical}</p>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <span className="text-accent font-bold text-lg">{demoResult.warningCount}</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t.demo.warnings}</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="text-success font-bold text-lg">{demoResult.minorCount}</span>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t.demo.minor}</p>
                        </div>
                      </div>
                      {demoResult.findings.length > 0 && (
                        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{t.demo.flaggedTerms}:</h4>
                          {demoResult.findings.slice(0, 3).map((f: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                            >
                              <span className="font-mono font-semibold">"{f.term}"</span> - <span className="capitalize">{f.severity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Overlay mit CTA */}
                    <div className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg">
                      <div className="text-center p-6 max-w-md">
                        <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Detaillierte Analyse verfügbar
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                          Erhalten Sie vollständige Ergebnisse mit Handlungsempfehlungen, PDF-Bericht und konkreten Lösungsvorschlägen.
                        </p>
                        <Link href="/app">
                          <Button variant="primary" className="w-full py-4 text-lg font-semibold shadow-lg mb-3">
                            Kostenlos registrieren für vollständigen Bericht →
                          </Button>
                        </Link>
                        <Link href="#features-section" className="text-sm text-primary hover:underline">
                          Beispiel-Bericht ansehen
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
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
                  <Link
                    href="/pricing"
                    className="text-sm text-gray-400 hover:text-white transition-colors relative group inline-block"
                  >
                    Pricing
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
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
