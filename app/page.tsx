"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { scanText } from "@/lib/scanner-logic";
import { Shield, CheckCircle, AlertTriangle, TrendingUp, Users, FileText, Zap, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [demoText, setDemoText] = useState("");
  const [demoResult, setDemoResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);

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
  };

  const exampleTexts = [
    "Our product is 100% climate neutral and completely sustainable.",
    "Eco-friendly packaging made from sustainable materials.",
    "Made with 80% recycled materials (certified GRS Standard).",
  ];

  const faqs = [
    {
      question: "What is the Green Claims Directive?",
      answer: "The EU Green Claims Directive (2024/825) is a regulation that requires companies to substantiate all environmental claims in their marketing. It comes into effect in September 2026 and can result in fines of up to 4% of annual revenue for violations.",
    },
    {
      question: "How accurate is the scanner?",
      answer: "Our scanner checks against 260+ banned terms and phrases from the EU regulation. However, this tool is for guidance only and does not constitute legal advice. Always consult with legal experts for final compliance verification.",
    },
    {
      question: "Can I use this for legal compliance?",
      answer: "This tool helps identify potentially problematic claims, but it's not a substitute for legal review. We recommend consulting with compliance experts, especially for high-stakes marketing materials.",
    },
    {
      question: "What happens after I'm flagged?",
      answer: "Our tool provides specific alternative suggestions for each flagged term. You can review the suggestions, update your text, and re-scan to verify compliance.",
    },
    {
      question: "Do you store my data?",
      answer: "For free users, scans are processed client-side and not stored on our servers. For paid plans, we may store scan history for your convenience, but all data is encrypted and can be deleted upon request.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-serif font-bold">Green Claims Validator</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/app">
              <Button variant="outline" size="sm">Go to App</Button>
            </Link>
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero text-white py-24 md:py-40 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="fade-in-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 text-balance leading-tight">
              Don't Get Fined for Greenwashing
            </h1>
          </div>
          
          <div className="fade-in-up-delay-1">
            <p className="text-xl md:text-2xl lg:text-3xl mb-10 text-white/95 max-w-4xl mx-auto text-balance leading-relaxed font-light">
              Validate your marketing claims against EU regulations. 
              <span className="font-semibold text-white"> €40,000+ fines start September 2026.</span>
            </p>
          </div>
          
          <div className="fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={scrollToDemo}
              className="group relative px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold text-lg rounded-xl shadow-2xl hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center gap-2">
                Try Free Scanner
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <Link href="/app">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm px-8 py-4 text-lg font-semibold"
              >
                Go to Full App
              </Button>
            </Link>
          </div>
          
          <div className="fade-in-up-delay-2 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 w-fit mx-auto">
            <CheckCircle className="w-5 h-5 text-white" />
            <span className="text-sm md:text-base font-medium">EU Directive 2024/825 Compliant</span>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            The Greenwashing Problem
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="elevated" className="text-center">
              <AlertTriangle className="w-12 h-12 text-accent mx-auto mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">53%</div>
              <p className="text-gray-600 dark:text-gray-400">
                of environmental claims are misleading (EU Study)
              </p>
            </Card>
            <Card variant="elevated" className="text-center">
              <TrendingUp className="w-12 h-12 text-danger mx-auto mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">€40,000+</div>
              <p className="text-gray-600 dark:text-gray-400">
                average fine for greenwashing violations
              </p>
            </Card>
            <Card variant="elevated" className="text-center">
              <FileText className="w-12 h-12 text-success mx-auto mb-4" />
              <div className="text-4xl font-bold text-primary mb-2">260+</div>
              <p className="text-gray-600 dark:text-gray-400">
                banned terms and phrases to watch
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Paste Text", icon: FileText },
              { step: "2", title: "AI Scans", icon: Zap },
              { step: "3", title: "Get Results", icon: CheckCircle },
              { step: "4", title: "Export Report", icon: Shield },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {idx === 0 && "Paste your marketing text"}
                  {idx === 1 && "Scans for 260+ risky terms"}
                  {idx === 2 && "Instant results with severity levels"}
                  {idx === 3 && "Download compliance report"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo-section" className="py-16 bg-white dark:bg-gray-800 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Try It Free
          </h2>
          <div className="max-w-4xl mx-auto">
            <Card variant="elevated">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter your marketing text (500 char limit for demo)
                  </label>
                  <textarea
                    value={demoText}
                    onChange={(e) => {
                      const text = e.target.value.slice(0, 500);
                      setDemoText(text);
                    }}
                    placeholder="Paste your marketing text here..."
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
                      Try: {text.slice(0, 30)}...
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleDemoScan}
                  isLoading={isScanning}
                  className="w-full"
                  disabled={!demoText.trim()}
                >
                  Scan Now
                </Button>
              </div>
            </Card>

            {demoResult && (
              <Card variant="elevated" className="mt-6 animate-slide-up">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Results</h3>
                    <span
                      className={`text-lg font-bold ${
                        demoResult.score >= 70
                          ? "text-danger"
                          : demoResult.score >= 40
                          ? "text-accent"
                          : "text-success"
                      }`}
                    >
                      Risk: {demoResult.score}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-danger font-semibold">Critical: </span>
                      {demoResult.criticalCount}
                    </div>
                    <div>
                      <span className="text-accent font-semibold">Warnings: </span>
                      {demoResult.warningCount}
                    </div>
                    <div>
                      <span className="text-success font-semibold">Minor: </span>
                      {demoResult.minorCount}
                    </div>
                  </div>
                  {demoResult.findings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Flagged Terms:</h4>
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
                      Get Full Analysis <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Pricing
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Free",
                price: "€0",
                features: [
                  "3 scans per month",
                  "500 characters per scan",
                  "Basic risk assessment",
                ],
                cta: "Sign Up Free",
                popular: false,
              },
              {
                name: "Starter",
                price: "€29",
                period: "/month",
                features: [
                  "100 scans per month",
                  "Unlimited characters",
                  "Detailed compliance reports",
                  "Email support",
                ],
                cta: "Start 14-day Trial",
                popular: true,
              },
              {
                name: "Professional",
                price: "€99",
                period: "/month",
                features: [
                  "Unlimited scans",
                  "API access",
                  "Team collaboration (5 users)",
                  "Priority support",
                  "Legal review option (+€199/review)",
                ],
                cta: "Start 14-day Trial",
                popular: false,
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: [
                  "Everything in Pro",
                  "Dedicated account manager",
                  "Custom integrations",
                  "SLA guarantee",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, idx) => (
              <Card
                key={idx}
                variant={plan.popular ? "elevated" : "outlined"}
                className={`relative ${plan.popular ? "border-2 border-primary scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-serif font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    {plan.period && <span className="text-lg">{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6" />
                <span className="font-serif font-bold">Green Claims Validator</span>
              </div>
              <p className="text-sm text-gray-400">
                Made in Berlin 🇩🇪 for EU Compliance
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/app" className="hover:text-white">Web App</Link></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2024 Green Claims Validator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
