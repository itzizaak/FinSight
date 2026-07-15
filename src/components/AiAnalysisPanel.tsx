/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Bot, Sparkles, AlertCircle, RefreshCw, Key, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { CompanyFinancials, FinancialRatios, AiInsights } from "../types";

interface AiAnalysisPanelProps {
  financials: CompanyFinancials;
  ratios: FinancialRatios[];
  aiInsights: AiInsights | null;
  onUpdateAiInsights: (insights: AiInsights) => void;
  isLoading: boolean;
  onSetLoading: (val: boolean) => void;
}

export default function AiAnalysisPanel({
  financials,
  ratios,
  aiInsights,
  onUpdateAiInsights,
  isLoading,
  onSetLoading
}: AiAnalysisPanelProps) {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<"OVERVIEW" | "LIQUIDITY" | "PROFIT" | "SOLVENCY">("OVERVIEW");
  const [keyError, setKeyError] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleTriggerAnalysis = async () => {
    onSetLoading(true);
    setKeyError(false);
    setGeneralError(null);

    try {
      const res = await fetch("/api/analyze-statement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyFinancials: financials, ratios })
      });

      const json = await res.json();
      if (json.status === "success" && json.analysis) {
        onUpdateAiInsights(json.analysis);
      } else if (json.error === "GEMINI_API_KEY_MISSING") {
        setKeyError(true);
      } else {
        throw new Error(json.message || "Cognitive pipeline failed during statement ingestion.");
      }
    } catch (err: any) {
      console.error(err);
      setGeneralError(err.message || "Network transmission failed.");
    } finally {
      onSetLoading(false);
    }
  };

  return (
    <div id="ai-analysis" className="bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl">
      {/* Title Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-950/10 via-zinc-950 to-zinc-950 border-b border-zinc-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-sm font-mono font-bold tracking-wider text-indigo-400 uppercase">STEP 4 • AI-POWERED INSIGHTS Engine</h2>
          </div>
          <h1 className="text-xl font-sans font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-400" /> Active Cognitive Analysis
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Ingest raw balance sheet entries and run instant qualitative models under a Chartered Financial Analyst context.</p>
        </div>

        {!aiInsights && !isLoading && (
          <button
            onClick={handleTriggerAnalysis}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl border border-indigo-500 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-indigo-500/10"
          >
            <Sparkles className="h-4.5 w-4.5 text-indigo-200 animate-pulse" /> Trigger AI Statement Ingestion
          </button>
        )}

        {aiInsights && !isLoading && (
          <button
            onClick={handleTriggerAnalysis}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-mono text-xs font-bold px-4 py-2 rounded-xl border border-zinc-800 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-Analyze Statements
          </button>
        )}
      </div>

      {/* Main Panel Content Area */}
      <div className="p-6">
        
        {/* Loading placeholder */}
        {isLoading && (
          <div className="py-16 text-center space-y-4">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-zinc-300">Evaluating multi-period statements...</p>
              <p className="text-[10px] text-zinc-500 mt-1">Applying DuPont frameworks, liquidity trend reviews, and debt coverage checks.</p>
            </div>
          </div>
        )}

        {/* Missing API Key warning card */}
        {keyError && !isLoading && (
          <div className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-6 space-y-4 max-w-xl mx-auto text-center">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
            <div>
              <h3 className="font-sans font-bold text-white text-base">Gemini API Key Required</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                To activate real-time corporate financial statement analysis, please configure your <code className="bg-zinc-900 border border-zinc-800 text-indigo-400 px-1 rounded font-mono">GEMINI_API_KEY</code> environment variable in the Settings menu.
              </p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg text-left text-[11px] text-zinc-400 space-y-1 font-mono">
              <span className="text-white font-bold block mb-1">Configuration Steps:</span>
              <div>1. Open the <strong>Settings Menu</strong> in the top-right toolbar.</div>
              <div>2. Select <strong>Secrets</strong> and add a new secret.</div>
              <div>3. Set key to <strong className="text-indigo-400">GEMINI_API_KEY</strong> and paste your key.</div>
            </div>
          </div>
        )}

        {/* General error card */}
        {generalError && !isLoading && !keyError && (
          <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 space-y-4 max-w-xl mx-auto text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <div>
              <h3 className="font-sans font-bold text-white text-base">Transmission Failure</h3>
              <p className="text-xs text-zinc-400 mt-1">{generalError}</p>
            </div>
            <button
              onClick={handleTriggerAnalysis}
              className="bg-zinc-900 hover:bg-zinc-850 text-white font-mono text-xs font-semibold px-4 py-2 rounded-lg border border-zinc-800"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Not analyzed state */}
        {!aiInsights && !isLoading && !keyError && !generalError && (
          <div className="py-12 border-2 border-dashed border-zinc-900 rounded-xl text-center space-y-4 max-w-lg mx-auto">
            <Bot className="h-12 w-12 text-zinc-600 mx-auto" />
            <div>
              <h3 className="font-sans font-bold text-zinc-300 text-sm">Statements Awaiting Processing</h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                We have calculated raw liquidity, profitability, solvency, and efficiency ratios. Trigger the AI analysis engine to calculate strategic takeaways, strengths, and weaknesses.
              </p>
            </div>
            <button
              onClick={handleTriggerAnalysis}
              className="inline-flex items-center gap-1.5 bg-indigo-950/60 border border-indigo-900 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all"
            >
              Analyze Company Performance <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Fully Analyzed State Dashboard */}
        {aiInsights && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            
            {/* Left side: In-depth categorized sections tabs */}
            <div className="lg:col-span-8 space-y-5">
              {/* Category tabs */}
              <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl max-w-max">
                <button
                  onClick={() => setActiveAnalysisTab("OVERVIEW")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all uppercase ${
                    activeAnalysisTab === "OVERVIEW"
                      ? "bg-zinc-950 text-indigo-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Executive Overview
                </button>
                <button
                  onClick={() => setActiveAnalysisTab("LIQUIDITY")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all uppercase ${
                    activeAnalysisTab === "LIQUIDITY"
                      ? "bg-zinc-950 text-indigo-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Liquidity Runway
                </button>
                <button
                  onClick={() => setActiveAnalysisTab("PROFIT")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all uppercase ${
                    activeAnalysisTab === "PROFIT"
                      ? "bg-zinc-950 text-indigo-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Profitability Deep-Dive
                </button>
                <button
                  onClick={() => setActiveAnalysisTab("SOLVENCY")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all uppercase ${
                    activeAnalysisTab === "SOLVENCY"
                      ? "bg-zinc-950 text-indigo-400"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Solvency Audit
                </button>
              </div>

              {/* Tab Content Cards */}
              <div className="bg-zinc-900/20 border border-zinc-850 p-5 rounded-xl min-h-[160px] flex flex-col justify-between">
                <div>
                  <h4 className="font-mono text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    {activeAnalysisTab === "OVERVIEW" && "CFA Executive Summary"}
                    {activeAnalysisTab === "LIQUIDITY" && "Liquidity Runway & Coverage Inquest"}
                    {activeAnalysisTab === "PROFIT" && "Pricing Power & Returns on Injected Capital"}
                    {activeAnalysisTab === "SOLVENCY" && "Debt Leverage, Solvency Risk & Interest Burdens"}
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {activeAnalysisTab === "OVERVIEW" && aiInsights.overview}
                    {activeAnalysisTab === "LIQUIDITY" && aiInsights.liquidityAnalysis}
                    {activeAnalysisTab === "PROFIT" && aiInsights.profitabilityAnalysis}
                    {activeAnalysisTab === "SOLVENCY" && aiInsights.solvencyAnalysis}
                  </p>
                </div>
                
                <div className="mt-4 pt-3.5 border-t border-zinc-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>Context: {financials.companyName} ({financials.ticker})</span>
                  <span>Ingestion Engine: Gemini Analyst Mode</span>
                </div>
              </div>

              {/* Actionable recommendations list */}
              <div className="bg-zinc-900/10 border border-zinc-850 p-5 rounded-xl space-y-3.5">
                <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" /> Strategic Action Plans
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {aiInsights.recommendations.map((rec, i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-1.5 relative overflow-hidden">
                      <div className="absolute right-3 top-2 font-mono text-2xl font-black text-zinc-900 select-none">{i+1}</div>
                      <div className="text-[10px] font-mono text-indigo-400 font-bold">TACTICAL ACTION</div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Summary scoreboard of Strengths vs Risks */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Asset Strengths List */}
              <div className="bg-zinc-900/30 border border-zinc-850 p-5 rounded-2xl space-y-3">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider border-b border-zinc-900 pb-2">
                  Corporate Strengths
                </div>
                <div className="space-y-3">
                  {aiInsights.strengths.map((str, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <span className="bg-emerald-950 border border-emerald-900/50 text-emerald-400 font-mono text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        ✓
                      </span>
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">{str}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identified Risks & Weaknesses List */}
              <div className="bg-zinc-900/30 border border-zinc-850 p-5 rounded-2xl space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider border-b border-zinc-900 pb-2">
                  Vulnerabilities & Weaknesses
                </div>
                <div className="space-y-3">
                  {aiInsights.weaknesses.map((wk, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <span className="bg-amber-950 border border-amber-900/50 text-amber-400 font-mono text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        !
                      </span>
                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">{wk}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
