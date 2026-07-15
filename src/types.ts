/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PeriodData {
  year: string;
  
  // Income Statement
  revenue: number;
  cogs: number;
  grossProfit: number;
  opex: number;
  ebitda: number;
  ebit: number;
  interestExpense: number;
  taxExpense: number;
  netIncome: number;

  // Balance Sheet
  cashAndEquivalents: number;
  accountsReceivable: number;
  inventory: number;
  totalCurrentAssets: number;
  ppe: number; // Net Property, Plant and Equipment
  totalAssets: number;
  accountsPayable: number;
  shortTermDebt: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  totalLiabilities: number;
  totalEquity: number;

  // Cash Flow Statement
  operatingCashFlow: number;
  capex: number;
  financingCashFlow: number;
  investingCashFlow: number;
  freeCashFlow: number;
}

export interface CompanyFinancials {
  companyName: string;
  ticker: string;
  sector: string;
  periods: PeriodData[];
}

export interface FinancialRatios {
  year: string;
  
  // Liquidity
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;

  // Profitability
  grossMargin: number; // %
  operatingMargin: number; // %
  netMargin: number; // %
  returnOnAssets: number; // %
  returnOnEquity: number; // %

  // Solvency / Leverage
  debtToEquity: number;
  debtToAssets: number;
  debtRatio: number; // Total Liabilities / Total Assets
  interestCoverageRatio: number;

  // Efficiency / Activity
  assetTurnover: number;
  inventoryTurnover: number;
  receivablesTurnover: number;
  daysSalesOutstanding: number;

  // Cash Flow
  operatingCashFlowRatio: number; // OCF / Current Liabilities
  freeCashFlow: number; // OCF - CapEx
}

export interface DuPontAnalysis {
  year: string;
  netMargin: number;
  assetTurnover: number;
  equityMultiplier: number;
  roe: number;
}

export interface AiInsights {
  overview: string;
  strengths: string[];
  weaknesses: string[];
  liquidityAnalysis: string;
  profitabilityAnalysis: string;
  solvencyAnalysis: string;
  recommendations: string[];
}

export interface HealthScoreResult {
  score: number;
  rating: string;
  color: string;
  bgColor: string;
  description: string;
  breakdown: {
    liquidity: number;
    profitability: number;
    solvency: number;
    efficiency: number;
    cashFlow: number;
  };
}
