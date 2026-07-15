/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PeriodData, FinancialRatios, DuPontAnalysis, HealthScoreResult } from "./types";

export function calculateRatios(p: PeriodData): FinancialRatios {
  const safeDiv = (num: number, den: number): number => {
    if (!den || den === 0) return 0;
    return num / den;
  };

  const currentRatio = safeDiv(p.totalCurrentAssets, p.totalCurrentLiabilities);
  const quickRatio = safeDiv(p.totalCurrentAssets - p.inventory, p.totalCurrentLiabilities);
  const cashRatio = safeDiv(p.cashAndEquivalents, p.totalCurrentLiabilities);

  const grossMargin = safeDiv(p.grossProfit, p.revenue) * 100;
  const operatingMargin = safeDiv(p.ebit, p.revenue) * 100;
  const netMargin = safeDiv(p.netIncome, p.revenue) * 100;
  const returnOnAssets = safeDiv(p.netIncome, p.totalAssets) * 100;
  const returnOnEquity = safeDiv(p.netIncome, p.totalEquity) * 100;

  const debtToEquity = safeDiv(p.totalLiabilities, p.totalEquity);
  const debtToAssets = safeDiv(p.totalLiabilities, p.totalAssets);
  const debtRatio = safeDiv(p.totalLiabilities, p.totalAssets);
  const interestCoverageRatio = p.interestExpense > 0 ? safeDiv(p.ebit, p.interestExpense) : 999.9;

  const assetTurnover = safeDiv(p.revenue, p.totalAssets);
  const inventoryTurnover = p.inventory > 0 ? safeDiv(p.cogs, p.inventory) : 0;
  const receivablesTurnover = p.accountsReceivable > 0 ? safeDiv(p.revenue, p.accountsReceivable) : 0;
  const daysSalesOutstanding = p.revenue > 0 ? (safeDiv(p.accountsReceivable, p.revenue) * 365) : 0;

  const operatingCashFlowRatio = safeDiv(p.operatingCashFlow, p.totalCurrentLiabilities);
  const freeCashFlow = p.operatingCashFlow - p.capex;

  return {
    year: p.year,
    currentRatio,
    quickRatio,
    cashRatio,
    grossMargin,
    operatingMargin,
    netMargin,
    returnOnAssets,
    returnOnEquity,
    debtToEquity,
    debtToAssets,
    debtRatio,
    interestCoverageRatio,
    assetTurnover,
    inventoryTurnover,
    receivablesTurnover,
    daysSalesOutstanding,
    operatingCashFlowRatio,
    freeCashFlow,
  };
}

export function calculateDuPont(p: PeriodData): DuPontAnalysis {
  const safeDiv = (num: number, den: number): number => {
    if (!den || den === 0) return 0;
    return num / den;
  };

  const netMargin = safeDiv(p.netIncome, p.revenue) * 100;
  const assetTurnover = safeDiv(p.revenue, p.totalAssets);
  const equityMultiplier = safeDiv(p.totalAssets, p.totalEquity);
  const roe = safeDiv(p.netIncome, p.totalEquity) * 100;

  return {
    year: p.year,
    netMargin,
    assetTurnover,
    equityMultiplier,
    roe,
  };
}

export function calculateHealthScore(r: FinancialRatios): HealthScoreResult {
  // If the company has no operations, return zero health score immediately
  if (r.currentRatio === 0 && r.grossMargin === 0 && r.assetTurnover === 0 && r.freeCashFlow === 0) {
    return {
      score: 0,
      rating: "Distressed",
      color: "text-red-400",
      bgColor: "bg-red-950/15 border-red-900/40 text-red-400",
      description: "Inoperative or empty financial profile. No active operational data detected.",
      breakdown: {
        liquidity: 0,
        profitability: 0,
        solvency: 0,
        efficiency: 0,
        cashFlow: 0
      }
    };
  }

  let liquidity = 0;
  let profitability = 0;
  let solvency = 0;
  let efficiency = 0;
  let cashFlow = 0;

  // 1. Liquidity (Max 25)
  // Current Ratio (Max 15)
  if (r.currentRatio >= 2.0) liquidity += 15;
  else if (r.currentRatio >= 1.5) liquidity += 12;
  else if (r.currentRatio >= 1.0) liquidity += 8;
  else if (r.currentRatio >= 0.5) liquidity += 4;
  
  // Cash Ratio (Max 10)
  if (r.cashRatio >= 1.0) liquidity += 10;
  else if (r.cashRatio >= 0.5) liquidity += 8;
  else if (r.cashRatio >= 0.2) liquidity += 5;
  else if (r.cashRatio >= 0.1) liquidity += 2;

  // 2. Profitability (Max 30)
  // Net Margin (Max 10)
  if (r.netMargin >= 15) profitability += 10;
  else if (r.netMargin >= 8) profitability += 8;
  else if (r.netMargin >= 3) profitability += 5;
  else if (r.netMargin > 0) profitability += 2;

  // ROE (Max 10)
  if (r.returnOnEquity >= 15) profitability += 10;
  else if (r.returnOnEquity >= 8) profitability += 8;
  else if (r.returnOnEquity >= 3) profitability += 5;
  else if (r.returnOnEquity > 0) profitability += 2;

  // Gross Margin (Max 10)
  if (r.grossMargin >= 50) profitability += 10;
  else if (r.grossMargin >= 30) profitability += 7;
  else if (r.grossMargin >= 15) profitability += 4;

  // 3. Solvency / Leverage (Max 20)
  // Debt to Equity (Max 10)
  if (r.debtToEquity <= 0.5 && r.debtToEquity >= 0) solvency += 10;
  else if (r.debtToEquity <= 1.0) solvency += 8;
  else if (r.debtToEquity <= 1.5) solvency += 5;
  else if (r.debtToEquity <= 2.5) solvency += 2;

  // Interest Coverage (Max 10)
  if (r.interestCoverageRatio >= 5.0 || r.interestCoverageRatio === 999.9) solvency += 10;
  else if (r.interestCoverageRatio >= 3.0) solvency += 8;
  else if (r.interestCoverageRatio >= 1.5) solvency += 5;
  else if (r.interestCoverageRatio >= 1.0) solvency += 2;

  // 4. Efficiency (Max 15)
  // Asset Turnover (Max 7)
  if (r.assetTurnover >= 1.2) efficiency += 7;
  else if (r.assetTurnover >= 0.8) efficiency += 5;
  else if (r.assetTurnover >= 0.4) efficiency += 3;

  // Days Sales Outstanding (Max 8)
  if (r.daysSalesOutstanding <= 45 && r.daysSalesOutstanding > 0) efficiency += 8;
  else if (r.daysSalesOutstanding <= 75 && r.daysSalesOutstanding > 0) efficiency += 5;
  else if (r.daysSalesOutstanding <= 120 && r.daysSalesOutstanding > 0) efficiency += 2;

  // 5. Cash Flow Quality (Max 10)
  // Free Cash Flow & OCF Ratio
  if (r.freeCashFlow > 0) {
    cashFlow += 5;
  }
  if (r.operatingCashFlowRatio >= 1.0) {
    cashFlow += 5;
  } else if (r.operatingCashFlowRatio >= 0.5) {
    cashFlow += 3;
  }

  const score = liquidity + profitability + solvency + efficiency + cashFlow;

  let rating = "Distressed";
  let color = "text-red-400";
  let bgColor = "bg-red-950/15 border-red-900/40 text-red-400";
  let description = "Critical warning. Severe operational liquidity gaps, high debt servicing constraints, or loss-making operations.";

  if (score >= 85) {
    rating = "Excellent";
    color = "text-emerald-400";
    bgColor = "bg-emerald-950/15 border-emerald-900/40 text-emerald-400";
    description = "Pristine fundamental health. Top-tier profitability, superb liquidity buffers, and minimal debt risk.";
  } else if (score >= 70) {
    rating = "Strong";
    color = "text-indigo-400";
    bgColor = "bg-indigo-950/15 border-indigo-900/40 text-indigo-400";
    description = "Robust operations. Strong cash generation, comfortable debt leverage levels, and healthy margins.";
  } else if (score >= 50) {
    rating = "Satisfactory";
    color = "text-amber-400";
    bgColor = "bg-amber-950/15 border-amber-900/40 text-amber-400";
    description = "Stable performance. Some minor inefficiencies or leverage weight, but adequate operational stability.";
  } else if (score >= 35) {
    rating = "Vulnerable";
    color = "text-orange-400";
    bgColor = "bg-orange-950/15 border-orange-900/40 text-orange-400";
    description = "Significant pressure. Tight current assets coverage, thin profit boundaries, or elevated leverage risks.";
  }

  return {
    score,
    rating,
    color,
    bgColor,
    description,
    breakdown: {
      liquidity,
      profitability,
      solvency,
      efficiency,
      cashFlow
    }
  };
}

// Convert numbers into standard clean business formats (M, B, K, etc.)
export function formatCurrency(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (absValue >= 1e12) {
    return `${sign}$${(absValue / 1e12).toFixed(2)}T`;
  }
  if (absValue >= 1e9) {
    return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}$${(absValue / 1e3).toFixed(1)}K`;
  }
  return `${sign}$${absValue.toFixed(0)}`;
}

// Format numbers nicely without dollar symbol
export function formatNumber(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(2)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(2)}M`;
  }
  return `${sign}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

// A standard parsing template for blank statement template
export const EMPTY_PERIOD_TEMPLATE: PeriodData = {
  year: "2025",
  revenue: 10000000,
  cogs: 4000000,
  grossProfit: 6000000,
  opex: 3500000,
  ebitda: 2800000,
  ebit: 2500000,
  interestExpense: 200000,
  taxExpense: 460000,
  netIncome: 1840000,

  cashAndEquivalents: 2000000,
  accountsReceivable: 1200000,
  inventory: 800000,
  totalCurrentAssets: 4000000,
  ppe: 5000000,
  totalAssets: 9000000,
  accountsPayable: 900000,
  shortTermDebt: 500000,
  totalCurrentLiabilities: 1400000,
  longTermDebt: 2000000,
  totalLiabilities: 3400000,
  totalEquity: 5600000,

  operatingCashFlow: 2200000,
  capex: 1200000,
  financingCashFlow: -600000,
  investingCashFlow: -1100000,
  freeCashFlow: 1000000
};
