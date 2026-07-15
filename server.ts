/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Preset Financial Statement Templates (Apple, Tesla, a high-growth SaaS Startup, a traditional Retail Chain)
const samples = [
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

// Lazy Gemini API Initializer to prevent startup crashes if GEMINI_API_KEY is not defined
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST endpoints
app.get("/api/samples", (req, res) => {
  res.json({ status: "success", data: samples });
});

// AI analysis route
app.post("/api/analyze-statement", async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        status: "error",
        error: "GEMINI_API_KEY_MISSING",
        message: "Please configure your GEMINI_API_KEY environment variable in the Settings menu to activate real-time cognitive reporting."
      });
    }

    const { companyFinancials, ratios } = req.body;
    if (!companyFinancials || !companyFinancials.periods || companyFinancials.periods.length === 0) {
      return res.status(400).json({ status: "error", message: "Invalid or empty financials payload." });
    }

    const { companyName, ticker, sector, periods } = companyFinancials;

    // Build the prompt for Gemini
    const prompt = `Perform an institutional-grade financial statement analysis and qualitative review for the following company:
Company: ${companyName} (${ticker})
Sector: ${sector}

Financial Statement Periods:
${periods.map((p: any, idx: number) => {
  const r = ratios[idx] || {};
  return `--- Period ${p.year} ---
- Revenue: $${p.revenue.toLocaleString()} (Gross Profit: $${p.grossProfit.toLocaleString()}, Net Income: $${p.netIncome.toLocaleString()})
- Operating Income (EBIT): $${p.ebit.toLocaleString()}
- Cash and Equivalents: $${p.cashAndEquivalents.toLocaleString()}
- Total Current Assets: $${p.totalCurrentAssets.toLocaleString()} (Total Assets: $${p.totalAssets.toLocaleString()})
- Total Current Liabilities: $${p.totalCurrentLiabilities.toLocaleString()} (Total Liabilities: $${p.totalLiabilities.toLocaleString()})
- Total Equity: $${p.totalEquity.toLocaleString()}
- Operating Cash Flow: $${p.operatingCashFlow.toLocaleString()} (Free Cash Flow: $${p.freeCashFlow.toLocaleString()})

Calculated Ratios:
- Current Ratio: ${r.currentRatio?.toFixed(2)}x (Quick Ratio: ${r.quickRatio?.toFixed(2)}x)
- Gross Margin: ${r.grossMargin?.toFixed(1)}% (Operating Margin: ${r.operatingMargin?.toFixed(1)}%, Net Margin: ${r.netMargin?.toFixed(1)}%)
- Return on Assets (ROA): ${r.returnOnAssets?.toFixed(1)}% (Return on Equity (ROE): ${r.returnOnEquity?.toFixed(1)}%)
- Debt to Equity: ${r.debtToEquity?.toFixed(2)}x
`;
}).join("\n")}

Provide a complete analysis strictly in the following JSON format. Return ONLY the valid JSON object, starting with { and ending with }. Do not wrap in Markdown blocks like \`\`\`json.

{
  "overview": "A cohesive executive summary of the financial health of the firm across the analyzed periods. Identify structural shifts, revenue growth trends, and capital allocation efficiencies.",
  "strengths": [
    "Detail of strength 1 with exact numerical metric",
    "Detail of strength 2 with exact numerical metric",
    "Detail of strength 3"
  ],
  "weaknesses": [
    "Detail of weakness 1 with exact numerical metric",
    "Detail of weakness 2",
    "Detail of weakness 3"
  ],
  "liquidityAnalysis": "A crisp, detailed review of liquidity status, analyzing the cash runway, short-term obligations coverage, and working capital cycles.",
  "profitabilityAnalysis": "Analysis of gross, operating, and net margins, highlighting pricing power, cost management, and returns on capital invested.",
  "solvencyAnalysis": "A review of debt loading, leverage ratios, risk of distress, and interest burden handling.",
  "recommendations": [
    "Actionable, strategically robust recommendation 1 for management/investors",
    "Actionable, strategically robust recommendation 2",
    "Actionable, strategically robust recommendation 3"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a chartered financial analyst (CFA) and elite private equity investment committee lead. Provide crisp, mathematically correct, highly professional insights. Always output strict JSON.",
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    let parsedResult;
    try {
      parsedResult = JSON.parse(text.trim());
    } catch (parseError) {
      // Fallback clean-up if markdown block was returned
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedResult = JSON.parse(cleanJson);
    }

    res.json({
      status: "success",
      analysis: parsedResult
    });
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "An error occurred during financial statement analysis compilation."
    });
  }
});

// Setup development server or serve build folders in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FinSight server running on port ${PORT}`);
  });
}

startServer();
