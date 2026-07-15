/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { Printer, Download, ArrowRight, Shield, Calendar, BookOpen, AlertTriangle } from "lucide-react";
import { CompanyFinancials, FinancialRatios, AiInsights } from "../types";
import { formatCurrency } from "../utils";

interface ReportExportProps {
  financials: CompanyFinancials;
  ratios: FinancialRatios[];
  aiInsights: AiInsights | null;
  onPrint: () => void;
}

export default function ReportExport({ financials, ratios, aiInsights, onPrint }: ReportExportProps) {
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div id="report-export" className="bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-6">
      
      {/* Step / Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-sm font-mono font-bold tracking-wider text-indigo-400 uppercase">STEP 5 • AUDIT & REPORT EXPORT</h2>
          </div>
          <h3 className="font-sans font-bold text-white text-base">Generate Institutional Memorandum</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Publish a ready-to-print executive financial report with calculations and Gemini-powered recommendations.</p>
        </div>

        <button
          onClick={onPrint}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl border border-indigo-500 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
        >
          <Printer className="h-4 w-4" /> Print Analyst Report (PDF)
        </button>
      </div>

      {/* Actual Report Sheet Layout Container (optimized for printing / print layout classes) */}
      <div className="bg-white text-zinc-900 rounded-xl p-8 max-w-4xl mx-auto shadow-2xl border border-zinc-200 print:border-0 print:p-0 print:shadow-none space-y-8 font-sans">
        
        {/* Letterhead Header */}
        <div className="border-b-4 border-zinc-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-[10px] font-mono font-black text-indigo-600 tracking-wider uppercase mb-1">FINSIGHT INVESTMENT INTELLIGENCE GROUP</div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Financial Performance & Audit Memorandum</h1>
            <p className="text-xs text-zinc-500 mt-1">Institutional analysis compiled for stakeholders and investment committees.</p>
          </div>
          <div className="text-left md:text-right font-mono text-xs text-zinc-500 space-y-0.5">
            <div><strong>Entity:</strong> {financials.companyName} ({financials.ticker})</div>
            <div><strong>Sector:</strong> {financials.sector}</div>
            <div><strong>Date:</strong> {dateStr}</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-zinc-900 border-b border-zinc-200 pb-1.5 uppercase flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-600" /> I. Executive Overview
          </h2>
          <p className="text-xs text-zinc-700 leading-relaxed">
            {aiInsights?.overview || `A complete financial review of ${financials.companyName} (${financials.ticker}) across ${financials.periods.length} distinct periods has been completed. This automated brief provides immediate transparency into core liquidity parameters, margin expansions, and strategic recommendations.`}
          </p>
        </div>

        {/* Section 2: Financial Accounts Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-zinc-900 border-b border-zinc-200 pb-1.5 uppercase flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" /> II. Comparative Account Statements
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-300">
                  <th className="p-2.5 font-bold text-zinc-700">Statement Account Item</th>
                  {financials.periods.map((p) => (
                    <th key={p.year} className="p-2.5 text-right font-bold text-zinc-700">{p.year} ($)</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                <tr>
                  <td className="p-2 font-medium text-zinc-800">Total Topline Revenue</td>
                  {financials.periods.map((p) => (
                    <td key={p.year} className="p-2 text-right font-mono text-zinc-950 font-semibold">{p.revenue.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium text-zinc-800">Gross Profit</td>
                  {financials.periods.map((p) => (
                    <td key={p.year} className="p-2 text-right font-mono text-zinc-950">{p.grossProfit.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-zinc-50">
                  <td className="p-2 font-bold text-zinc-900">Operating Income (EBIT)</td>
                  {financials.periods.map((p) => (
                    <td key={p.year} className="p-2 text-right font-mono text-zinc-900 font-bold">{p.ebit.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium text-zinc-800">Net Income</td>
                  {financials.periods.map((p) => (
                    <td key={p.year} className="p-2 text-right font-mono text-zinc-950 font-semibold">{p.netIncome.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-zinc-50">
                  <td className="p-2 font-bold text-zinc-900">Cash and Equivalents</td>
                  {financials.periods.map((p) => (
                    <td key={p.year} className="p-2 text-right font-mono text-zinc-900 font-bold">{p.cashAndEquivalents.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium text-zinc-800">Total Stockholders' Equity</td>
                  {financials.periods.map((p) => (
                    <td key={p.year} className="p-2 text-right font-mono text-zinc-950">{p.totalEquity.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium text-zinc-800">Free Cash Flow (FCF)</td>
                  {financials.periods.map((p) => (
                    <td key={p.year} className="p-2 text-right font-mono text-zinc-950 font-semibold">{p.freeCashFlow.toLocaleString()}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Ratio Audits */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-zinc-900 border-b border-zinc-200 pb-1.5 uppercase flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-600" /> III. Calculated Ratio Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-100 border-b border-zinc-300">
                  <th className="p-2.5 font-bold text-zinc-700">Calculated Ratios</th>
                  {ratios.map((r) => (
                    <th key={r.year} className="p-2.5 text-right font-bold text-zinc-700">{r.year}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                <tr>
                  <td className="p-2 font-medium text-zinc-800">Current Ratio (Liquidity)</td>
                  {ratios.map((r) => (
                    <td key={r.year} className="p-2 text-right font-mono text-zinc-900">{r.currentRatio.toFixed(2)}x</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium text-zinc-800">Gross Margin % (Profitability)</td>
                  {ratios.map((r) => (
                    <td key={r.year} className="p-2 text-right font-mono text-zinc-900">{r.grossMargin.toFixed(1)}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium text-zinc-800">Operating Margin % (Efficiency)</td>
                  {ratios.map((r) => (
                    <td key={r.year} className="p-2 text-right font-mono text-zinc-900">{r.operatingMargin.toFixed(1)}%</td>
                  ))}
                </tr>
                <tr className="bg-zinc-50">
                  <td className="p-2 font-bold text-zinc-900">Return on Equity % (ROE)</td>
                  {ratios.map((r) => (
                    <td key={r.year} className="p-2 text-right font-mono text-zinc-900 font-bold">{r.returnOnEquity.toFixed(1)}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2 font-medium text-zinc-800">Debt-to-Equity (Solvency)</td>
                  {ratios.map((r) => (
                    <td key={r.year} className="p-2 text-right font-mono text-zinc-900">{r.debtToEquity.toFixed(2)}x</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Qualitative AI Audits */}
        {aiInsights && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Strengths */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-emerald-700 border-b border-emerald-100 pb-1 uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Core Asset Strengths
              </h3>
              <ul className="space-y-2">
                {aiInsights.strengths.map((str, i) => (
                  <li key={i} className="text-xs text-zinc-700 leading-relaxed flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses / Risks */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-bold text-amber-700 border-b border-amber-100 pb-1 uppercase flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Identified Vulnerabilities
              </h3>
              <ul className="space-y-2">
                {aiInsights.weaknesses.map((wk, i) => (
                  <li key={i} className="text-xs text-zinc-700 leading-relaxed flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Section 5: Strategic Actionable Guidelines */}
        {aiInsights && aiInsights.recommendations.length > 0 && (
          <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-zinc-900 uppercase">IV. Strategic Corrective Actions</h3>
            <ol className="space-y-2.5 text-xs text-zinc-700">
              {aiInsights.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="bg-zinc-200 text-zinc-800 font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Advisory Disclaimer */}
        <div className="border-t border-zinc-200 pt-5 text-center text-[9px] text-zinc-400 font-mono leading-relaxed">
          CONFIDENTIALITY NOTICE: This analyst report has been generated through FinSight's automated platform incorporating advanced analytical modeling parameters. It does not constitute formal underwriting advice, certified CPA auditing, or registered investment advisory.
        </div>

      </div>

    </div>
  );
}
