/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateRatios, calculateDuPont, calculateHealthScore } from "./utils";
import { PeriodData } from "./types";

// Helper assertion function
function assertCloseTo(actual: number, expected: number, precision = 0.01, message: string) {
  const diff = Math.abs(actual - expected);
  if (diff > precision) {
    console.error(`❌ FAIL: ${message} (Expected ${expected}, but got ${actual})`);
    process.exit(1);
  } else {
    console.log(`  ✅ PASS: ${message} (${actual.toFixed(4)} matches expected ${expected.toFixed(4)})`);
  }
}

console.log("==================================================");
console.log("RUNNING FINANCIAL ENGINE MATHEMATICAL AUDIT...");
console.log("==================================================");

// Mock robust statement matching expected corporate parameters
const mockPeriod: PeriodData = {
  year: "2024",
  revenue: 1000000,
  cogs: 600000,
  grossProfit: 400000,
  opex: 200000,
  ebitda: 200000,
  ebit: 150000,
  interestExpense: 30000,
  taxExpense: 24000,
  netIncome: 96000,

  cashAndEquivalents: 150000,
  accountsReceivable: 100000,
  inventory: 50000,
  totalCurrentAssets: 300000,
  ppe: 500000,
  totalAssets: 800000,
  accountsPayable: 80000,
  shortTermDebt: 40000,
  totalCurrentLiabilities: 120000,
  longTermDebt: 180000,
  totalLiabilities: 300000,
  totalEquity: 500000,

  operatingCashFlow: 180000,
  capex: 80000,
  financingCashFlow: -20000,
  investingCashFlow: -60000,
  freeCashFlow: 100000
};

const ratios = calculateRatios(mockPeriod);

console.log("\n[1] testing liquidity ratios...");
assertCloseTo(ratios.currentRatio, 300000 / 120000, 0.001, "Current Ratio (CA / CL)");
assertCloseTo(ratios.quickRatio, (300000 - 50000) / 120000, 0.001, "Quick Ratio ((CA - Inv) / CL)");
assertCloseTo(ratios.cashRatio, 150000 / 120000, 0.001, "Cash Ratio (Cash / CL)");

console.log("\n[2] testing profitability metrics...");
assertCloseTo(ratios.grossMargin, (400000 / 1000000) * 100, 0.001, "Gross Margin %");
assertCloseTo(ratios.operatingMargin, (150000 / 1000000) * 100, 0.001, "Operating Margin %");
assertCloseTo(ratios.netMargin, (96000 / 1000000) * 100, 0.001, "Net Margin %");
assertCloseTo(ratios.returnOnAssets, (96000 / 800000) * 100, 0.001, "ROA %");
assertCloseTo(ratios.returnOnEquity, (96000 / 500000) * 100, 0.001, "ROE %");

console.log("\n[3] testing leverage & solvency ratios...");
assertCloseTo(ratios.debtRatio, 300000 / 800000, 0.001, "Debt Ratio (TL / TA)");
assertCloseTo(ratios.debtToEquity, 300000 / 500000, 0.001, "Debt-to-Equity (TL / Equity)");

console.log("\n[4] testing efficiency ratios...");
assertCloseTo(ratios.assetTurnover, 1000000 / 800000, 0.001, "Asset Turnover (Rev / TA)");
assertCloseTo(ratios.inventoryTurnover, 600000 / 50000, 0.001, "Inventory Turnover (COGS / Inv)");

console.log("\n[5] testing cash flow ratios...");
assertCloseTo(ratios.operatingCashFlowRatio, 180000 / 120000, 0.001, "Operating Cash Flow Ratio (OCF / CL)");
assertCloseTo(ratios.freeCashFlow, 180000 - 80000, 0.001, "Free Cash Flow (OCF - CapEx)");

console.log("\n[6] testing DuPont framework integrity...");
const duPont = calculateDuPont(mockPeriod);
assertCloseTo(duPont.roe, ratios.returnOnEquity, 0.001, "DuPont ROE Consistency");
const computedRoeFromDupont = (duPont.netMargin / 100) * duPont.assetTurnover * duPont.equityMultiplier * 100;
assertCloseTo(computedRoeFromDupont, duPont.roe, 0.001, "Reconstructed ROE from components");

// 7. Testing boundary limits (e.g. zeros)
const zeroPeriod: PeriodData = {
  year: "2025",
  revenue: 0,
  cogs: 0,
  grossProfit: 0,
  opex: 0,
  ebitda: 0,
  ebit: 0,
  interestExpense: 0,
  taxExpense: 0,
  netIncome: 0,
  cashAndEquivalents: 0,
  accountsReceivable: 0,
  inventory: 0,
  totalCurrentAssets: 0,
  ppe: 0,
  totalAssets: 0,
  accountsPayable: 0,
  shortTermDebt: 0,
  totalCurrentLiabilities: 0,
  longTermDebt: 0,
  totalLiabilities: 0,
  totalEquity: 0,
  operatingCashFlow: 0,
  capex: 0,
  financingCashFlow: 0,
  investingCashFlow: 0,
  freeCashFlow: 0
};

console.log("\n[7] testing Division-by-Zero safety audits...");
const zeroRatios = calculateRatios(zeroPeriod);
assertCloseTo(zeroRatios.currentRatio, 0, 0.001, "Zero values safety limit (Current Ratio)");
assertCloseTo(zeroRatios.grossMargin, 0, 0.001, "Zero values safety limit (Gross Margin)");
assertCloseTo(zeroRatios.operatingCashFlowRatio, 0, 0.001, "Zero values safety limit (OCF Ratio)");

console.log("\n[8] testing Financial Health Score engine...");
const normalHealth = calculateHealthScore(ratios);
console.log(`  - Mock Company Health Score: ${normalHealth.score}/100 Rating: ${normalHealth.rating}`);
if (normalHealth.score > 50 && normalHealth.rating !== "Distressed") {
  console.log("  ✅ PASS: Healthy mock company scored as stable or strong!");
} else {
  console.log("  ❌ FAIL: Healthy mock company incorrectly flagged as distressed.");
  process.exit(1);
}

const zeroHealth = calculateHealthScore(zeroRatios);
console.log(`  - Zero-State Company Health Score: ${zeroHealth.score}/100 Rating: ${zeroHealth.rating}`);
if (zeroHealth.score <= 10 && zeroHealth.rating === "Distressed") {
  console.log("  ✅ PASS: Empty shell company correctly scored as distressed!");
} else {
  console.log("  ❌ FAIL: Empty shell company scored too high.");
  process.exit(1);
}

console.log("\n==================================================");
console.log("🎉 ALL TESTS PASSED! THE FINANCIAL ENGINE IS SECURE.");
console.log("==================================================");
