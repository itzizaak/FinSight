/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  FileSpreadsheet, 
  TrendingUp, 
  Sparkles, 
  Printer, 
  Layers, 
  BookOpen, 
  Building,
  Home,
  Settings,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { CompanyFinancials } from "./types";
import { useFinancialViewModel } from "./viewmodels/useFinancialViewModel";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Screen Components
import HomeScreen from "./components/HomeScreen";
import UploadSection from "./components/UploadSection";
import RatioDashboard from "./components/RatioDashboard";
import ChartsDashboard from "./components/ChartsDashboard";
import AiAnalysisPanel from "./components/AiAnalysisPanel";
import ReportExport from "./components/ReportExport";
import SettingsScreen from "./components/SettingsScreen";

// High-fidelity local financial statement benchmarks
const LOCAL_SAMPLES: CompanyFinancials[] = [
  {
    companyName: "Apple Inc.",
    ticker: "AAPL",
    sector: "Technology / Consumer Electronics",
    periods: [
      {
        year: "2023",
        revenue: 383285000000,
        cogs: 214137000000,
        grossProfit: 169148000000,
        opex: 54847000000,
        ebitda: 125820000000,
        ebit: 114301000000,
        interestExpense: 3933000000,
        taxExpense: 16741000000,
        netIncome: 96995000000,
        cashAndEquivalents: 29965000000,
        accountsReceivable: 61540000000,
        inventory: 6331000000,
        totalCurrentAssets: 143566000000,
        ppe: 43715000000,
        totalAssets: 352580000000,
        accountsPayable: 62611000000,
        shortTermDebt: 15807000000,
        totalCurrentLiabilities: 145308000000,
        longTermDebt: 95080000000,
        totalLiabilities: 290437000000,
        totalEquity: 62143000000,
        operatingCashFlow: 110574000000,
        capex: 10959000000,
        financingCashFlow: -108488000000,
        investingCashFlow: 3705000000,
        freeCashFlow: 99615000000
      },
      {
        year: "2024",
        revenue: 391035000000,
        cogs: 210850000000,
        grossProfit: 180185000000,
        opex: 56500000000,
        ebitda: 135200000000,
        ebit: 123685000000,
        interestExpense: 3500000000,
        taxExpense: 18100000000,
        netIncome: 102085000000,
        cashAndEquivalents: 32400000000,
        accountsReceivable: 65200000000,
        inventory: 5800000000,
        totalCurrentAssets: 158500000000,
        ppe: 45200000000,
        totalAssets: 365000000000,
        accountsPayable: 64100000000,
        shortTermDebt: 14500000000,
        totalCurrentLiabilities: 138000000000,
        longTermDebt: 88000000000,
        totalLiabilities: 278000000000,
        totalEquity: 87000000000,
        operatingCashFlow: 118400000000,
        capex: 9500000000,
        financingCashFlow: -112000000000,
        investingCashFlow: 1200000000,
        freeCashFlow: 108900000000
      }
    ]
  },
  {
    companyName: "Tesla, Inc.",
    ticker: "TSLA",
    sector: "Automotive / Clean Energy",
    periods: [
      {
        year: "2023",
        revenue: 96773000000,
        cogs: 79113000000,
        grossProfit: 17660000000,
        opex: 8769000000,
        ebitda: 14210000000,
        ebit: 8891000000,
        interestExpense: 156000000,
        taxExpense: 1120000000,
        netIncome: 14997000000,
        cashAndEquivalents: 29095000000,
        accountsReceivable: 3122000000,
        inventory: 13626000000,
        totalCurrentAssets: 49600000000,
        ppe: 29725000000,
        totalAssets: 104500000000,
        accountsPayable: 14450000000,
        shortTermDebt: 2300000000,
        totalCurrentLiabilities: 28700000000,
        longTermDebt: 2850000000,
        totalLiabilities: 43000000000,
        totalEquity: 61500000000,
        operatingCashFlow: 13256000000,
        capex: 8899000000,
        financingCashFlow: -2510000000,
        investingCashFlow: -11210000000,
        freeCashFlow: 4357000000
      },
      {
        year: "2024",
        revenue: 108500000000,
        cogs: 88200000000,
        grossProfit: 20300000000,
        opex: 9400000000,
        ebitda: 16800000000,
        ebit: 10900000000,
        interestExpense: 120000000,
        taxExpense: 1350000000,
        netIncome: 13420000000,
        cashAndEquivalents: 33600000000,
        accountsReceivable: 3500000000,
        inventory: 14200000000,
        totalCurrentAssets: 55400000000,
        ppe: 33500000000,
        totalAssets: 118000000000,
        accountsPayable: 15600000000,
        shortTermDebt: 1800000000,
        totalCurrentLiabilities: 30500000000,
        longTermDebt: 1500000000,
        totalLiabilities: 46000000000,
        totalEquity: 72000000000,
        operatingCashFlow: 15100000000,
        capex: 9800000000,
        financingCashFlow: -1200000000,
        investingCashFlow: -11800000000,
        freeCashFlow: 5300000000
      }
    ]
  },
  {
    companyName: "Acme CloudSaaS Ltd",
    ticker: "ACME",
    sector: "Software as a Service (Startup)",
    periods: [
      {
        year: "2023",
        revenue: 4500000,
        cogs: 900000,
        grossProfit: 3600000,
        opex: 4800000,
        ebitda: -1100000,
        ebit: -1200000,
        interestExpense: 15000,
        taxExpense: 5000,
        netIncome: -1220000,
        cashAndEquivalents: 2800000,
        accountsReceivable: 450000,
        inventory: 0,
        totalCurrentAssets: 3350000,
        ppe: 120000,
        totalAssets: 3520000,
        accountsPayable: 180000,
        shortTermDebt: 50000,
        totalCurrentLiabilities: 320000,
        longTermDebt: 0,
        totalLiabilities: 320000,
        totalEquity: 3200000,
        operatingCashFlow: -950000,
        capex: 45000,
        financingCashFlow: 4000000,
        investingCashFlow: -100000,
        freeCashFlow: -995000
      },
      {
        year: "2024",
        revenue: 9200000,
        cogs: 1650000,
        grossProfit: 7550000,
        opex: 6900000,
        ebitda: 750000,
        ebit: 650000,
        interestExpense: 12000,
        taxExpense: 110000,
        netIncome: 528000,
        cashAndEquivalents: 3100000,
        accountsReceivable: 880000,
        inventory: 0,
        totalCurrentAssets: 4180000,
        ppe: 180000,
        totalAssets: 4420000,
        accountsPayable: 290000,
        shortTermDebt: 30000,
        totalCurrentLiabilities: 450000,
        longTermDebt: 0,
        totalLiabilities: 450000,
        totalEquity: 3970000,
        operatingCashFlow: 610000,
        capex: 80000,
        financingCashFlow: 200000,
        investingCashFlow: -120000,
        freeCashFlow: 530000
      }
    ]
  }
];

// Aesthetic Accent Color Mapper
const ACCENT_MAP = {
  indigo: {
    text: "text-indigo-400",
    bg: "bg-indigo-600 hover:bg-indigo-500",
    border: "border-indigo-500/80",
    rawBg: "bg-indigo-950/20",
    glow: "shadow-indigo-600/15"
  },
  emerald: {
    text: "text-emerald-400",
    bg: "bg-emerald-600 hover:bg-emerald-500",
    border: "border-emerald-500/80",
    rawBg: "bg-emerald-950/20",
    glow: "shadow-emerald-600/15"
  },
  violet: {
    text: "text-violet-400",
    bg: "bg-violet-600 hover:bg-violet-500",
    border: "border-violet-500/80",
    rawBg: "bg-violet-950/20",
    glow: "shadow-violet-600/15"
  },
  rose: {
    text: "text-rose-400",
    bg: "bg-rose-600 hover:bg-rose-500",
    border: "border-rose-500/80",
    rawBg: "bg-rose-950/20",
    glow: "shadow-rose-600/15"
  },
  cyan: {
    text: "text-cyan-400",
    bg: "bg-cyan-600 hover:bg-cyan-500",
    border: "border-cyan-500/80",
    rawBg: "bg-cyan-950/20",
    glow: "shadow-cyan-600/15"
  }
};

export default function App() {
  const {
    activeTab,
    setActiveTab,
    samples,
    financials,
    calculatedRatios,
    aiInsights,
    setAiInsights,
    isLoadingAi,
    setIsLoadingAi,
    settings,
    logs,
    selectCompanyByTicker,
    updateActiveFinancials,
    updateSettings,
    triggerStatementAnalysis,
    clearSystemLogs
  } = useFinancialViewModel(LOCAL_SAMPLES);

  const activeAccent = ACCENT_MAP[settings.accentColor || "indigo"];

  // Print Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      
      {/* Top Banner Navigation Header */}
      <header className="border-b border-zinc-850 bg-zinc-950/85 backdrop-blur-md px-6 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sticky top-0 z-40 print:hidden">
        
        {/* Brand identity */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setActiveTab("HOME")}
        >
          <div className={`w-9 h-9 rounded-xl ${activeAccent.bg} text-white flex items-center justify-center font-bold tracking-tight shadow-lg ${activeAccent.glow}`}>
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-black tracking-tight text-white text-base">FinSight</h1>
              <span className={`bg-zinc-900 border border-zinc-800 ${activeAccent.text} font-mono text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide`}>
                v1.1 RELEASE
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-500">Corporate Finance & Investment Intelligence Desk</p>
          </div>
        </div>

        {/* Dynamic Nav Tabs */}
        <nav className="flex flex-wrap items-center gap-1 bg-zinc-900/60 p-1 border border-zinc-850 rounded-xl font-mono text-xs font-semibold">
          
          <button
            onClick={() => setActiveTab("HOME")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "HOME"
                ? "bg-zinc-850 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Home className="h-3.5 w-3.5" /> Home
          </button>

          <button
            onClick={() => setActiveTab("INPUT")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "INPUT"
                ? "bg-zinc-850 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> 1. Input
          </button>

          <button
            onClick={() => setActiveTab("RATIOS")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "RATIOS"
                ? "bg-zinc-850 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" /> 2. Ratios
          </button>

          <button
            onClick={() => setActiveTab("CHARTS")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "CHARTS"
                ? "bg-zinc-850 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" /> 3. Charts
          </button>

          <button
            onClick={() => setActiveTab("AI")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "AI"
                ? "bg-zinc-850 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 ${activeAccent.text}`} /> 4. AI Insights
          </button>

          <button
            onClick={() => setActiveTab("REPORT")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "REPORT"
                ? "bg-zinc-850 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Printer className="h-3.5 w-3.5 text-emerald-400" /> 5. Publish
          </button>

          <button
            onClick={() => setActiveTab("SETTINGS")}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === "SETTINGS"
                ? "bg-zinc-850 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Settings className="h-3.5 w-3.5" /> Settings
          </button>

        </nav>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6 print:p-0 print:max-w-none">
        
        {/* Error boundary wrapped content pane */}
        <ErrorBoundary fallbackTitle="Workspace Section Crash">
          
          {activeTab === "HOME" && (
            <HomeScreen
              financials={financials}
              ratios={calculatedRatios}
              samples={samples}
              onSelectCompany={selectCompanyByTicker}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === "INPUT" && (
            <UploadSection
              samples={samples}
              financials={financials}
              onUpdateFinancials={updateActiveFinancials}
              isLoadingAi={isLoadingAi}
            />
          )}

          {activeTab === "RATIOS" && (
            <RatioDashboard
              financials={financials}
              ratios={calculatedRatios}
            />
          )}

          {activeTab === "CHARTS" && (
            <ChartsDashboard
              financials={financials}
              ratios={calculatedRatios}
            />
          )}

          {activeTab === "AI" && (
            <AiAnalysisPanel
              financials={financials}
              ratios={calculatedRatios}
              aiInsights={aiInsights}
              onUpdateAiInsights={setAiInsights}
              isLoading={isLoadingAi}
              onSetLoading={setIsLoadingAi}
            />
          )}

          {activeTab === "REPORT" && (
            <ReportExport
              financials={financials}
              ratios={calculatedRatios}
              aiInsights={aiInsights}
              onPrint={handlePrintReport}
            />
          )}

          {activeTab === "SETTINGS" && (
            <SettingsScreen
              settings={settings}
              logs={logs}
              onUpdateSettings={updateSettings}
              onClearLogs={clearSystemLogs}
            />
          )}

        </ErrorBoundary>

      </main>

      {/* Footer Status Panel */}
      <footer className="border-t border-zinc-850 bg-zinc-950 py-4 px-6 text-center font-mono text-[10px] text-zinc-600 flex flex-col md:flex-row justify-between gap-2 print:hidden">
        <span>© 2026 FinSight Intelligence. Institutional and corporate statement audit suite. All rights reserved.</span>
        <span className="flex items-center justify-center gap-1 text-zinc-500">
          <Building className={`h-3.5 w-3.5 ${activeAccent.text}/80`} /> Core Clean-MVVM architecture framework active.
        </span>
      </footer>

    </div>
  );
}
