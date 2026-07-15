/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { TrendingUp, Percent, ShieldCheck, Zap, Layers, ArrowUpRight, ArrowDownRight, Award, Coins } from "lucide-react";
import { CompanyFinancials, FinancialRatios } from "../types";
import { calculateRatios, calculateDuPont, formatCurrency } from "../utils";

interface RatioDashboardProps {
  financials: CompanyFinancials;
  ratios: FinancialRatios[];
}

export default function RatioDashboard({ financials, ratios }: RatioDashboardProps) {
  // Compute trend direction for a ratio
  const renderTrendSymbol = (curr: number, prev: number | undefined, lowerIsBetter = false) => {
    if (prev === undefined) return null;
    const diff = curr - prev;
    if (Math.abs(diff) < 0.005) return <span className="text-zinc-500 font-mono text-[10px] ml-1.5">• Flat</span>;

    const positiveResult = diff > 0;
    const isGood = lowerIsBetter ? !positiveResult : positiveResult;

    return (
      <span className={`inline-flex items-center text-[10px] font-bold font-mono ml-2 px-1.5 py-0.5 rounded ${
        isGood 
          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40" 
          : "bg-red-950/40 text-red-400 border border-red-900/40"
      }`}>
        {positiveResult ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
        {Math.abs(diff).toFixed(2)}
        {diff > 0 ? "" : ""}
      </span>
    );
  };

  const renderPercentageTrendSymbol = (curr: number, prev: number | undefined) => {
    if (prev === undefined) return null;
    const diff = curr - prev;
    if (Math.abs(diff) < 0.05) return <span className="text-zinc-500 font-mono text-[10px] ml-1.5">• Flat</span>;

    const isGood = diff > 0;

    return (
      <span className={`inline-flex items-center text-[10px] font-bold font-mono ml-2 px-1.5 py-0.5 rounded ${
        isGood 
          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40" 
          : "bg-red-950/40 text-red-400 border border-red-900/40"
      }`}>
        {isGood ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
        {Math.abs(diff).toFixed(1)}%
      </span>
    );
  };

  return (
    <div id="ratio-dashboard" className="space-y-6">
      
      {/* Steps / Overview bar */}
      <div className="flex items-center gap-2 mb-1">
        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
        <h2 className="text-sm font-mono font-bold tracking-wider text-indigo-400 uppercase">STEP 2 • AUTOMATED METRIC CALCULATION</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Liquidity Card */}
        <div id="liquidity-health-card" className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <div className="p-2 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/40">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-white text-sm">Liquidity Health</h3>
              <p className="text-[10px] text-zinc-500 font-mono">Short-term solvency safety</p>
            </div>
          </div>
          
          <div className="space-y-3.5">
            {ratios.map((r, idx) => {
              const prev = ratios[idx - 1];
              return (
                <div key={r.year} className="space-y-1 bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900">
                  <div className="text-[10px] font-mono text-zinc-400 font-bold">{r.year} Period</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Current Ratio</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.currentRatio.toFixed(2)}x
                      {renderTrendSymbol(r.currentRatio, prev?.currentRatio)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Quick Ratio</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.quickRatio.toFixed(2)}x
                      {renderTrendSymbol(r.quickRatio, prev?.quickRatio)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Cash Ratio</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.cashRatio.toFixed(2)}x
                      {renderTrendSymbol(r.cashRatio, prev?.cashRatio)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profitability Card */}
        <div id="profitability-card" className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <div className="p-2 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/40">
              <Percent className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-white text-sm">Profitability</h3>
              <p className="text-[10px] text-zinc-500 font-mono">Margin efficiencies & returns</p>
            </div>
          </div>
          
          <div className="space-y-3.5">
            {ratios.map((r, idx) => {
              const prev = ratios[idx - 1];
              return (
                <div key={r.year} className="space-y-1 bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900">
                  <div className="text-[10px] font-mono text-zinc-400 font-bold">{r.year} Period</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Gross Margin</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.grossMargin.toFixed(1)}%
                      {renderPercentageTrendSymbol(r.grossMargin, prev?.grossMargin)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Operating Margin</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.operatingMargin.toFixed(1)}%
                      {renderPercentageTrendSymbol(r.operatingMargin, prev?.operatingMargin)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Net Margin</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.netMargin.toFixed(1)}%
                      {renderPercentageTrendSymbol(r.netMargin, prev?.netMargin)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">ROA</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.returnOnAssets.toFixed(1)}%
                      {renderPercentageTrendSymbol(r.returnOnAssets, prev?.returnOnAssets)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">ROE</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.returnOnEquity.toFixed(1)}%
                      {renderPercentageTrendSymbol(r.returnOnEquity, prev?.returnOnEquity)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Solvency / Leverage Card */}
        <div id="solvency-leverage-card" className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <div className="p-2 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/40">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-white text-sm">Debt & Leverage</h3>
              <p className="text-[10px] text-zinc-500 font-mono">Long-term solvency coverage</p>
            </div>
          </div>
          
          <div className="space-y-3.5">
            {ratios.map((r, idx) => {
              const prev = ratios[idx - 1];
              return (
                <div key={r.year} className="space-y-1 bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900">
                  <div className="text-[10px] font-mono text-zinc-400 font-bold">{r.year} Period</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Debt to Equity</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.debtToEquity.toFixed(2)}x
                      {renderTrendSymbol(r.debtToEquity, prev?.debtToEquity, true)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Debt Ratio</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.debtRatio.toFixed(2)}x
                      {renderTrendSymbol(r.debtRatio, prev?.debtRatio, true)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Interest Coverage</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.interestCoverageRatio >= 999.9 ? "No Debt" : `${r.interestCoverageRatio.toFixed(2)}x`}
                      {r.interestCoverageRatio < 999.9 && renderTrendSymbol(r.interestCoverageRatio, prev?.interestCoverageRatio)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Efficiency Card */}
        <div id="efficiency-metrics-card" className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <div className="p-2 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/40">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-white text-sm">Efficiency Metrics</h3>
              <p className="text-[10px] text-zinc-500 font-mono">Working capital rotations</p>
            </div>
          </div>
          
          <div className="space-y-3.5">
            {ratios.map((r, idx) => {
              const prev = ratios[idx - 1];
              return (
                <div key={r.year} className="space-y-1 bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900">
                  <div className="text-[10px] font-mono text-zinc-400 font-bold">{r.year} Period</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Asset Turnover</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.assetTurnover.toFixed(2)}x
                      {renderTrendSymbol(r.assetTurnover, prev?.assetTurnover)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Inventory Turnover</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.inventoryTurnover.toFixed(1)}x
                      {renderTrendSymbol(r.inventoryTurnover, prev?.inventoryTurnover)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">DSO (Days Outstanding)</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.daysSalesOutstanding.toFixed(0)} Days
                      {renderTrendSymbol(r.daysSalesOutstanding, prev?.daysSalesOutstanding, true)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cash Flow Card */}
        <div id="cash-flow-metrics-card" className="bg-zinc-950 border border-zinc-850 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
            <div className="p-2 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/40">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-white text-sm">Cash Flow Metrics</h3>
              <p className="text-[10px] text-zinc-500 font-mono">Operating & free cash generation</p>
            </div>
          </div>
          
          <div className="space-y-3.5">
            {ratios.map((r, idx) => {
              const prev = ratios[idx - 1];
              return (
                <div key={r.year} className="space-y-1 bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900">
                  <div className="text-[10px] font-mono text-zinc-400 font-bold">{r.year} Period</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">OCF Ratio</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {r.operatingCashFlowRatio.toFixed(2)}x
                      {renderTrendSymbol(r.operatingCashFlowRatio, prev?.operatingCashFlowRatio)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-300">Free Cash Flow</span>
                    <span className="font-mono text-xs font-bold text-white">
                      {formatCurrency(r.freeCashFlow)}
                      {renderTrendSymbol(r.freeCashFlow, prev?.freeCashFlow)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DuPont Analysis Interactive Classroom widget */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden p-6 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-indigo-400 font-mono text-xs font-bold">
              <Award className="h-4 w-4" /> ACADEMIC FOCUS
            </div>
            <h3 className="font-sans font-bold text-white text-base">DuPont Analysis Framework</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Learn how the corporate entity generates its Return on Equity (ROE) by decomposing it into Net Profitability, Asset Turnover, and Financial Leverage.</p>
          </div>
          
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-mono text-zinc-400 leading-relaxed max-w-sm">
            <span className="text-white font-bold block mb-1">DuPont Formula Decomposition:</span>
            <span className="text-indigo-400 font-bold">ROE</span> = Net Margin (%) × Asset Turnover (x) × Equity Multiplier (x)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DuPont Cards for all periods */}
          <div className="space-y-4">
            {financials.periods.map((p) => {
              const dp = calculateDuPont(p);
              return (
                <div key={p.year} className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl space-y-4 relative overflow-hidden">
                  <div className="absolute right-4 top-4 font-mono text-2xl font-black text-zinc-900 select-none">
                    {p.year}
                  </div>
                  
                  <div className="flex items-center justify-between relative z-10 border-b border-zinc-800/60 pb-2">
                    <span className="font-mono text-xs font-bold text-zinc-300">{p.year} DuPont Matrix</span>
                    <span className="font-mono text-sm font-bold text-indigo-400">ROE: {dp.roe.toFixed(2)}%</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded-lg">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block">1. Net Margin</span>
                      <span className="font-mono text-xs font-bold text-white block mt-0.5">{dp.netMargin.toFixed(1)}%</span>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded-lg">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block">2. Asset Turnover</span>
                      <span className="font-mono text-xs font-bold text-white block mt-0.5">{dp.assetTurnover.toFixed(2)}x</span>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded-lg">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block">3. Equity Multiplier</span>
                      <span className="font-mono text-xs font-bold text-white block mt-0.5">{dp.equityMultiplier.toFixed(2)}x</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DuPont Explanation Educational Sidebar */}
          <div className="bg-zinc-900/20 border border-zinc-850 p-5 rounded-xl flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-zinc-200 flex items-center gap-1.5 uppercase">
                <Layers className="h-4 w-4 text-zinc-500" /> Drivers of Return on Equity (ROE)
              </h4>
              <ul className="space-y-3.5 text-xs text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <div>
                    <strong className="text-zinc-200">Operating Efficiency (Net Margin):</strong> Measures the profitability per dollar of sales. Increasing margins indicate stronger cost discipline or premium pricing power.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <div>
                    <strong className="text-zinc-200">Asset Use Efficiency (Asset Turnover):</strong> Measures how effectively the company deploys its capital assets to generate top-line sales volume. High turnover means heavy capacity utilization.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <div>
                    <strong className="text-zinc-200">Financial Leverage (Equity Multiplier):</strong> Reflects the degree of debt backing the asset pool. Higher leverage scales up ROE, but introduces greater solvency volatility.
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mt-5 p-3.5 bg-indigo-950/20 border border-indigo-900/40 rounded-lg text-[11px] text-indigo-300 leading-relaxed">
              <strong>Professional Analyst Takeaway:</strong> If ROE expansion is driven strictly by increased equity multiplier (financial leverage) without margin improvements, the expansion may represent elevated distress exposure rather than operating excellence.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
