/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  ComposedChart
} from "recharts";
import { CompanyFinancials, FinancialRatios } from "../types";
import { formatCurrency, formatNumber, calculateHealthScore } from "../utils";
import { 
  TrendingUp, 
  Percent, 
  LayoutGrid, 
  Scale, 
  Coins, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Award, 
  DollarSign, 
  Activity 
} from "lucide-react";

interface ChartsDashboardProps {
  financials: CompanyFinancials;
  ratios: FinancialRatios[];
}

export default function ChartsDashboard({ financials, ratios }: ChartsDashboardProps) {
  const years = financials.periods.map((p) => p.year).sort();
  const [selectedYear, setSelectedYear] = useState<string>(years[years.length - 1] || "");

  // Find index of current year and previous year
  const activeIndex = financials.periods.findIndex((p) => p.year === selectedYear);
  const currentPeriod = financials.periods[activeIndex];
  const currentRatio = ratios.find((r) => r.year === selectedYear);

  const prevPeriod = activeIndex > 0 ? financials.periods[activeIndex - 1] : null;
  const prevRatio = activeIndex > 0 ? ratios.find((r) => r.year === financials.periods[activeIndex - 1].year) : null;

  // Calculate health score
  const healthScoreResult = currentRatio ? calculateHealthScore(currentRatio) : null;

  // Data formatters for Recharts
  const growthData = financials.periods.map((p) => {
    const r = ratios.find((ratio) => ratio.year === p.year);
    return {
      year: p.year,
      Revenue: p.revenue,
      "Gross Profit": p.grossProfit,
      "Net Income": p.netIncome,
      "Operating Cash Flow": p.operatingCashFlow,
      "Capital Expenditure": p.capex,
      "Free Cash Flow": p.freeCashFlow,
      "Gross Margin %": r ? Number(r.grossMargin.toFixed(1)) : 0,
      "Operating Margin %": r ? Number(r.operatingMargin.toFixed(1)) : 0,
      "Net Margin %": r ? Number(r.netMargin.toFixed(1)) : 0,
    };
  });

  const ratioComparisonData = ratios.map((r) => ({
    year: r.year,
    "Current Ratio (x)": Number(r.currentRatio.toFixed(2)),
    "Quick Ratio (x)": Number(r.quickRatio.toFixed(2)),
    "Debt to Equity (x)": Number(r.debtToEquity.toFixed(2)),
    "Asset Turnover (x)": Number(r.assetTurnover.toFixed(2))
  }));

  // Custom tooltips
  const formatCurrencyTooltip = (value: any) => {
    return [`$${value.toLocaleString()}`, ""];
  };

  const formatPercentTooltip = (value: any) => {
    return [`${value}%`, ""];
  };

  const formatRatioTooltip = (value: any) => {
    return [`${value}x`, ""];
  };

  // Helper for trend calculations
  const getYoYChange = (curr: number, prev: number | null | undefined, isPercent = false) => {
    if (prev === null || prev === undefined || prev === 0) return null;
    const change = ((curr - prev) / Math.abs(prev)) * 100;
    const isPositive = change >= 0;
    return {
      formatted: `${isPositive ? "▲" : "▼"} ${Math.abs(change).toFixed(1)}%`,
      isPositive
    };
  };

  const getAbsoluteChange = (curr: number, prev: number | null | undefined, suffix = "") => {
    if (prev === null || prev === undefined) return null;
    const diff = curr - prev;
    const isPositive = diff >= 0;
    return {
      formatted: `${isPositive ? "▲" : "▼"} ${isPositive ? "+" : ""}${diff.toFixed(2)}${suffix}`,
      isPositive
    };
  };

  // Circular gauge calculations
  const score = healthScoreResult?.score ?? 0;
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div id="charts-dashboard" className="space-y-6">
      
      {/* Step / Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-sm font-mono font-bold tracking-wider text-indigo-400 uppercase">STEP 3 • PERFORMANCE VISUALIZATION</h2>
          </div>
          <h1 className="text-2xl font-sans font-black tracking-tight text-white">Executive Finance Dashboard</h1>
          <p className="text-xs text-zinc-400 font-mono">Interactive financial health scores, executive KPIs, and historical trends</p>
        </div>

        {/* Year Toggles */}
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-xl border border-zinc-850">
          <span className="text-[10px] font-mono text-zinc-500 px-2 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> FOCAL PERIOD:
          </span>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                selectedYear === y
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Top Section: Health Score and KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Financial Health Score Widget */}
        <div id="financial-health-score" className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/40">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-white text-sm">Financial Health Score</h3>
                <p className="text-[10px] text-zinc-500 font-mono">{selectedYear} Period Snapshot</p>
              </div>
            </div>
            {healthScoreResult && (
              <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border uppercase ${healthScoreResult.bgColor}`}>
                {healthScoreResult.rating}
              </span>
            )}
          </div>

          {healthScoreResult && currentRatio ? (
            <div className="flex flex-col sm:flex-row items-center gap-6 py-1">
              {/* Radial Score Gauge */}
              <div className="relative flex-shrink-0 w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    className="stroke-zinc-900"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    stroke="currentColor"
                    className={`${healthScoreResult.color} transition-all duration-500`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-mono font-black text-white">{score}</span>
                  <span className="text-[9px] font-mono tracking-widest text-zinc-500 font-bold">/100</span>
                </div>
              </div>

              {/* Sub-Metric Score Progress Bars */}
              <div className="flex-1 w-full space-y-2 text-xs">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-0.5">
                    <span>LIQUIDITY</span>
                    <span className="font-bold text-zinc-200">{healthScoreResult.breakdown.liquidity}/25</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(healthScoreResult.breakdown.liquidity / 25) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-0.5">
                    <span>PROFITABILITY</span>
                    <span className="font-bold text-zinc-200">{healthScoreResult.breakdown.profitability}/30</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(healthScoreResult.breakdown.profitability / 30) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-0.5">
                    <span>SOLVENCY & LEVERAGE</span>
                    <span className="font-bold text-zinc-200">{healthScoreResult.breakdown.solvency}/20</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(healthScoreResult.breakdown.solvency / 20) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-0.5">
                    <span>EFFICIENCY & CAPITAL</span>
                    <span className="font-bold text-zinc-200">{healthScoreResult.breakdown.efficiency}/15</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(healthScoreResult.breakdown.efficiency / 15) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-28 flex items-center justify-center text-zinc-500 font-mono text-xs">
              Select a focal period to load health score
            </div>
          )}

          <div className="border-t border-zinc-900 pt-3 text-[11px] text-zinc-400 leading-relaxed font-sans">
            {healthScoreResult?.description}
          </div>
        </div>

        {/* 2x2 executive KPI Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Revenue Card */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">1. REVENUE GROWTH</span>
              <div className="p-1.5 bg-zinc-900 border border-zinc-800 text-indigo-400 rounded-lg">
                <DollarSign className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-mono font-black text-white">
                {currentPeriod ? formatCurrency(currentPeriod.revenue) : "$0.00"}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Gross sales generated</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">YoY Change</span>
              {currentPeriod && (() => {
                const change = getYoYChange(currentPeriod.revenue, prevPeriod?.revenue);
                if (!change) return <span className="text-[10px] font-mono text-zinc-500">Initial Period</span>;
                return (
                  <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 ${change.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                    {change.formatted}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Profitability Card */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">2. NET INCOME</span>
              <div className="p-1.5 bg-zinc-900 border border-zinc-800 text-emerald-400 rounded-lg">
                <Activity className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-mono font-black ${currentPeriod && currentPeriod.netIncome < 0 ? "text-rose-400" : "text-white"}`}>
                {currentPeriod ? formatCurrency(currentPeriod.netIncome) : "$0.00"}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Net profit margins after all costs</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">YoY Change</span>
              {currentPeriod && (() => {
                const change = getYoYChange(currentPeriod.netIncome, prevPeriod?.netIncome);
                if (!change) return <span className="text-[10px] font-mono text-zinc-500">Initial Period</span>;
                return (
                  <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 ${change.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                    {change.formatted}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Cash Flow Card */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">3. FREE CASH FLOW</span>
              <div className="p-1.5 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded-lg">
                <Coins className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className={`text-2xl font-mono font-black ${currentRatio && currentRatio.freeCashFlow < 0 ? "text-rose-400" : "text-white"}`}>
                {currentRatio ? formatCurrency(currentRatio.freeCashFlow) : "$0.00"}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Operating cash minus Capital expenditures</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">YoY Change</span>
              {currentRatio && (() => {
                const change = getYoYChange(currentRatio.freeCashFlow, prevRatio?.freeCashFlow);
                if (!change) return <span className="text-[10px] font-mono text-zinc-500">Initial Period</span>;
                return (
                  <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 ${change.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                    {change.formatted}
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Liquidity Coverage Card */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">4. LIQUIDITY COVERAGE</span>
              <div className="p-1.5 bg-zinc-900 border border-zinc-800 text-amber-400 rounded-lg">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-mono font-black text-white">
                {currentRatio ? `${currentRatio.currentRatio.toFixed(2)}x` : "0.00x"}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Current assets / Current liabilities</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">YoY Delta</span>
              {currentRatio && (() => {
                const change = getAbsoluteChange(currentRatio.currentRatio, prevRatio?.currentRatio, "x");
                if (!change) return <span className="text-[10px] font-mono text-zinc-500">Initial Period</span>;
                return (
                  <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 ${change.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                    {change.formatted}
                  </span>
                );
              })()}
            </div>
          </div>

        </div>
      </div>

      {/* Bento Grid: Performance Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trends with Gross Margin Line overlay */}
        <div className="bg-zinc-950 border border-zinc-850 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/40">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-white text-sm">Revenue Trends & Gross Margins</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Gross revenue generation with margins overlay</p>
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={growthData} margin={{ top: 10, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                <XAxis dataKey="year" stroke="#71717a" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
                <YAxis 
                  yAxisId="left"
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="JetBrains Mono" 
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1e6).toFixed(0)}M`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#a1a1aa" 
                  fontSize={11} 
                  fontFamily="JetBrains Mono" 
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px" }} 
                  labelStyle={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#fff", fontWeight: "bold" }}
                  itemStyle={{ fontFamily: "Inter", fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10, paddingTop: 10 }} />
                <Bar yAxisId="left" name="Revenue" dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line yAxisId="right" name="Gross Margin %" type="monotone" dataKey="Gross Margin %" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profitability Trends */}
        <div className="bg-zinc-950 border border-zinc-850 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/40">
                <Percent className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-white text-sm">Operating & Net Income Margins</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Profitability progression across multiple periods</p>
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                <XAxis dataKey="year" stroke="#71717a" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="JetBrains Mono" 
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px" }} 
                  labelStyle={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#fff", fontWeight: "bold" }}
                  itemStyle={{ fontFamily: "Inter", fontSize: 11 }}
                  formatter={formatPercentTooltip}
                />
                <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10, paddingTop: 10 }} />
                <Line type="monotone" name="Gross Margin %" dataKey="Gross Margin %" stroke="#f59e0b" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 3 }} />
                <Line type="monotone" name="Operating Margin %" dataKey="Operating Margin %" stroke="#6366f1" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 3 }} />
                <Line type="monotone" name="Net Margin %" dataKey="Net Margin %" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Free Cash Flow Trajectory vs Operating Cash Flow & CapEx */}
        <div className="bg-zinc-950 border border-zinc-850 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/40">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-white text-sm">Free Cash Flow Generation</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Operating cash flow compared to Capital Expenditures</p>
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorOcf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFcf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                <XAxis dataKey="year" stroke="#71717a" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={11} 
                  fontFamily="JetBrains Mono" 
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1e6).toFixed(0)}M`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px" }} 
                  labelStyle={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#fff", fontWeight: "bold" }}
                  itemStyle={{ fontFamily: "Inter", fontSize: 11 }}
                  formatter={formatCurrencyTooltip}
                />
                <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10, paddingTop: 10 }} />
                <Area type="monotone" name="Operating Cash Flow" dataKey="Operating Cash Flow" stroke="#6366f1" fillOpacity={1} fill="url(#colorOcf)" strokeWidth={2} />
                <Area type="monotone" name="Free Cash Flow" dataKey="Free Cash Flow" stroke="#10b981" fillOpacity={1} fill="url(#colorFcf)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ratio Comparison Charts: Balance Sheet Health */}
        <div className="bg-zinc-950 border border-zinc-850 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-950/50 text-indigo-400 rounded-lg border border-indigo-900/40">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-white text-sm">Key Ratio Comparison</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Comparing Liquidity and Leverage trends over periods</p>
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratioComparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                <XAxis dataKey="year" stroke="#71717a" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} fontFamily="JetBrains Mono" tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px" }} 
                  labelStyle={{ fontFamily: "JetBrains Mono", fontSize: 11, color: "#fff", fontWeight: "bold" }}
                  itemStyle={{ fontFamily: "Inter", fontSize: 11 }}
                  formatter={formatRatioTooltip}
                />
                <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10, paddingTop: 10 }} />
                <Line type="monotone" name="Current Ratio (x)" dataKey="Current Ratio (x)" stroke="#06b6d4" strokeWidth={2} activeDot={{ r: 5 }} dot={{ r: 3 }} />
                <Line type="monotone" name="Quick Ratio (x)" dataKey="Quick Ratio (x)" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 5 }} dot={{ r: 3 }} />
                <Line type="monotone" name="Debt to Equity (x)" dataKey="Debt to Equity (x)" stroke="#ec4899" strokeWidth={2} activeDot={{ r: 5 }} dot={{ r: 3 }} />
                <Line type="monotone" name="Asset Turnover (x)" dataKey="Asset Turnover (x)" stroke="#10b981" strokeWidth={2} activeDot={{ r: 5 }} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
