/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Building2, 
  ArrowRight, 
  FileSpreadsheet, 
  TrendingUp, 
  Sparkles, 
  Printer, 
  BookOpen, 
  Info,
  Layers,
  CheckCircle,
  HelpCircle,
  History,
  Workflow
} from "lucide-react";
import { CompanyFinancials, FinancialRatios } from "../types";
import { formatCurrency } from "../utils";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

interface HomeScreenProps {
  financials: CompanyFinancials;
  ratios: FinancialRatios[];
  samples: CompanyFinancials[];
  onSelectCompany: (ticker: string) => void;
  onNavigate: (tab: "INPUT" | "RATIOS" | "CHARTS" | "AI" | "REPORT" | "SETTINGS") => void;
}

export default function HomeScreen({
  financials,
  ratios,
  samples,
  onSelectCompany,
  onNavigate
}: HomeScreenProps) {
  
  // Calculate a brief overview of active financials
  const activePeriodsCount = financials.periods.length;
  const latestPeriod = financials.periods[financials.periods.length - 1];
  const firstPeriod = financials.periods[0];

  // Derive compounded or period-to-period revenue growth if possible
  let revenueGrowthStr = "0.0%";
  if (activePeriodsCount > 1 && latestPeriod && firstPeriod) {
    const rev1 = firstPeriod.revenue;
    const rev2 = latestPeriod.revenue;
    const growth = ((rev2 - rev1) / rev1) * 100;
    revenueGrowthStr = `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
  }

  // Define steps
  const steps = [
    {
      num: "01",
      title: "Statement Ingestion",
      desc: "Upload customized CSV/Excel sheets or manually input multi-period corporate ledger records.",
      tab: "INPUT" as const,
      icon: <FileSpreadsheet className="h-5 w-5 text-indigo-400" />
    },
    {
      num: "02",
      title: "Ratio Auditing",
      desc: "Instantly audit 15+ specialized ratios across Liquidity, Profitability, Solvency, and Asset Efficiency.",
      tab: "RATIOS" as const,
      icon: <TrendingUp className="h-5 w-5 text-blue-400" />
    },
    {
      num: "03",
      title: "Performance Charts",
      desc: "Graph trajectories of margins, leverage ratios, and cash flows across consecutive quarters or years.",
      tab: "CHARTS" as const,
      icon: <BookOpen className="h-5 w-5 text-amber-400" />
    },
    {
      num: "04",
      title: "AI Cognitive Insights",
      desc: "Ingest calculations into Gemini Pro to extract core qualitative risks, SWOT summaries, and tactics.",
      tab: "AI" as const,
      icon: <Sparkles className="h-5 w-5 text-purple-400" />
    },
    {
      num: "05",
      title: "Executive Printing",
      desc: "Publish and download high-quality, formatted financial memorandum reports suitable for investors.",
      tab: "REPORT" as const,
      icon: <Printer className="h-5 w-5 text-emerald-400" />
    }
  ];

  return (
    <div id="home-screen" className="space-y-8 animate-fade-in">
      
      {/* Premium Display Welcome Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/25 via-zinc-950/40 to-black border border-zinc-850 rounded-3xl p-8 md:p-12 space-y-6">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-emerald-600/5 blur-[80px] pointer-events-none" />

        <div className="space-y-3 max-w-3xl">
          <Badge variant="indigo" className="mb-2">Institutional Platform</Badge>
          <h1 className="text-3xl md:text-5xl font-sans font-black text-white tracking-tight leading-[1.1] md:leading-tight">
            Financial Statement Auditing & <span className="text-indigo-400">Cognitive Analysis</span> Desk
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans max-w-2xl">
            FinSight empowers chartered analysts and investment committees with instant multi-period ratio models, DuPont margin breakdowns, interactive chart generators, and Gemini-powered advisory memos.
          </p>
        </div>

        {/* Hero Quick actions and context status */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-900/60">
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => onNavigate("INPUT")} 
            className="gap-2 group"
          >
            Start New Audit <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="outline" 
            size="md" 
            onClick={() => onNavigate("SETTINGS")}
          >
            Adjust Assumptions
          </Button>
          
          <div className="hidden lg:flex items-center gap-2 ml-auto text-xs font-mono text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active context: <strong>{financials.companyName} ({financials.ticker})</strong></span>
          </div>
        </div>
      </div>

      {/* Grid: Selected Asset Scorecard & Sample Swapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Analysis Context Card (4 Columns) */}
        <Card variant="premium" className="lg:col-span-4 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-[10px] font-bold uppercase tracking-wider">
              <Building2 className="h-4 w-4" /> ACTIVE TARGET PROFILE
            </div>
            <div className="mt-2">
              <h3 className="font-sans font-black text-white text-lg tracking-tight leading-tight">{financials.companyName}</h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{financials.ticker} • {financials.sector}</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-2 gap-3 border-y border-zinc-900/60 py-3 font-mono text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px]">LATEST TOPLINE</span>
                <span className="text-white font-bold">{latestPeriod ? formatCurrency(latestPeriod.revenue) : "$0"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">NET PROFIT</span>
                <span className="text-white font-bold">{latestPeriod ? formatCurrency(latestPeriod.netIncome) : "$0"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">AUDIT HORIZON</span>
                <span className="text-white font-bold">{activePeriodsCount} Years ({financials.periods.map(p => p.year).join(" - ")})</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">GROWTH HORIZON</span>
                <span className={`font-bold ${revenueGrowthStr.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>
                  {revenueGrowthStr}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-zinc-500 text-[10px] font-mono uppercase block">Core Diagnostics</span>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="indigo">GAAP Compliant</Badge>
                <Badge variant="success">Multi-Period Active</Badge>
                {latestPeriod?.freeCashFlow > 0 ? (
                  <Badge variant="success">FCF Positive</Badge>
                ) : (
                  <Badge variant="warning">Cash Burn Alert</Badge>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-zinc-950/60 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-500">Calculated Ratios: {ratios.length} periods</span>
            <Button 
              variant="ghost" 
              size="xs" 
              onClick={() => onNavigate("RATIOS")} 
              className="text-indigo-400 hover:text-indigo-300 gap-1"
            >
              Check ratios <ArrowRight className="h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>

        {/* Corporate Benchmarks presets (8 Columns) */}
        <Card className="lg:col-span-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-white text-base">Corporate Performance Benchmarks</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Immediately load high-fidelity pre-compiled statement models from standard sectors.</p>
              </div>
              <Badge variant="info">Select to Load</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-0">
            {samples.map((company) => {
              const isActive = financials.ticker === company.ticker;
              const companyPeriods = company.periods;
              const lastYr = companyPeriods[companyPeriods.length - 1];
              const growth = companyPeriods.length > 1 
                ? ((lastYr.revenue - companyPeriods[0].revenue) / companyPeriods[0].revenue) * 100 
                : 0;

              return (
                <div
                  key={company.ticker}
                  onClick={() => onSelectCompany(company.ticker)}
                  className={`group border rounded-xl p-4 cursor-pointer transition-all ${
                    isActive
                      ? "border-indigo-500/80 bg-indigo-950/10 text-white"
                      : "border-zinc-850 bg-zinc-950/40 hover:border-zinc-800 hover:bg-zinc-900/30 text-zinc-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`font-mono text-xs font-black px-1.5 py-0.5 rounded ${isActive ? "bg-indigo-600 text-white" : "bg-zinc-900 text-zinc-400"}`}>
                      {company.ticker}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{companyPeriods.length} Years</span>
                  </div>

                  <h4 className="font-sans font-bold text-sm mt-3 group-hover:text-white transition-colors truncate">{company.companyName}</h4>
                  <p className="text-[10px] text-zinc-500 font-sans truncate">{company.sector}</p>

                  <div className="mt-4 pt-3 border-t border-zinc-900/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">LTS Rev:</span>
                    <span className="font-semibold text-zinc-300">{formatCurrency(lastYr?.revenue || 0)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">Revenue CAGR:</span>
                    <span className={`font-bold ${growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {growth >= 0 ? "+" : ""}{growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>

      {/* Step-by-Step System Workflow Map */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-indigo-400" />
          <h2 className="font-sans font-bold text-white text-lg tracking-tight">FinSight Guided Auditing Workflow</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              onClick={() => onNavigate(step.tab)}
              className="group bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-full space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-2xl font-black text-zinc-850 group-hover:text-indigo-950 transition-colors">{step.num}</span>
                  <div className="p-1.5 bg-zinc-900 rounded-lg border border-zinc-850 group-hover:bg-zinc-850">
                    {step.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-sans font-bold text-white text-xs group-hover:text-indigo-400 transition-colors">{step.title}</h3>
                  <p className="text-[10px] text-zinc-500 font-sans mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
              <div className="text-[9px] font-mono text-indigo-500 font-bold tracking-widest uppercase flex items-center gap-0.5 group-hover:text-indigo-400">
                Launch <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytical Documentation FAQ Banner */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-indigo-950/50 text-indigo-400 rounded-xl border border-indigo-900/40 mt-1 shrink-0">
            <Info className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-sans font-bold text-white text-sm">Accounting Formulas & Audit Standards</h4>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
              All metrics are structured according to GAAP/IFRS. Profitability margins, interest coverage margins, days sales outstanding, and asset efficiency ratios update instantly with zero lag. Open the Settings panel to configure targets and check live server health logs.
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigate("SETTINGS")} 
          className="shrink-0"
        >
          View System Logs
        </Button>
      </div>

    </div>
  );
}
