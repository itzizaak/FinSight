/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Upload, FileSpreadsheet, Plus, Trash2, Edit2, Info, CheckCircle2, ChevronRight, AlertCircle, RefreshCw, Layers } from "lucide-react";
import * as XLSX from "xlsx";
import { CompanyFinancials, PeriodData } from "../types";
import { formatCurrency, EMPTY_PERIOD_TEMPLATE } from "../utils";

interface UploadSectionProps {
  samples: CompanyFinancials[];
  financials: CompanyFinancials;
  onUpdateFinancials: (data: CompanyFinancials) => void;
  isLoadingAi: boolean;
}

const KEY_MAPPINGS: { [key: string]: keyof PeriodData } = {
  // Income Statement
  revenue: "revenue",
  sales: "revenue",
  totalrevenue: "revenue",
  turnover: "revenue",
  
  cogs: "cogs",
  costofgoods: "cogs",
  costofsales: "cogs",
  costofgoodssold: "cogs",
  
  grossprofit: "grossProfit",
  grossmargin: "grossProfit",
  
  opex: "opex",
  operatingexpense: "opex",
  operatingexpenses: "opex",
  sga: "opex",
  sellinggeneraladministrative: "opex",
  
  ebitda: "ebitda",
  operatingcashprofit: "ebitda",
  
  ebit: "ebit",
  operatingincome: "ebit",
  operatingprofit: "ebit",
  
  interest: "interestExpense",
  interestexpense: "interestExpense",
  interestexpenses: "interestExpense",
  financingcosts: "interestExpense",
  
  tax: "taxExpense",
  taxexpense: "taxExpense",
  taxexpenses: "taxExpense",
  incometaxes: "taxExpense",
  corporate_tax: "taxExpense",
  
  netincome: "netIncome",
  netprofit: "netIncome",
  earnings: "netIncome",
  netearnings: "netIncome",
  
  // Balance Sheet
  cash: "cashAndEquivalents",
  cashandequivalents: "cashAndEquivalents",
  cashandcashequivalents: "cashAndEquivalents",
  liquidassets: "cashAndEquivalents",
  
  accountsreceivable: "accountsReceivable",
  receivables: "accountsReceivable",
  trade_receivables: "accountsReceivable",
  debtors: "accountsReceivable",
  
  inventory: "inventory",
  inventories: "inventory",
  stocks: "inventory",
  
  currentassets: "totalCurrentAssets",
  totalcurrentassets: "totalCurrentAssets",
  
  ppe: "ppe",
  propertyplant: "ppe",
  propertyplantandequipment: "ppe",
  netppe: "ppe",
  fixedassets: "ppe",
  tangibleassets: "ppe",
  
  assets: "totalAssets",
  totalassets: "totalAssets",
  
  accountspayable: "accountsPayable",
  payables: "accountsPayable",
  trade_payables: "accountsPayable",
  creditors: "accountsPayable",
  
  shorttermdebt: "shortTermDebt",
  currentdebt: "shortTermDebt",
  notespayable: "shortTermDebt",
  
  currentliabilities: "totalCurrentLiabilities",
  totalcurrentliabilities: "totalCurrentLiabilities",
  
  longtermdebt: "longTermDebt",
  noncurrentdebt: "longTermDebt",
  bonds: "longTermDebt",
  
  liabilities: "totalLiabilities",
  totalliabilities: "totalLiabilities",
  
  equity: "totalEquity",
  totalequity: "totalEquity",
  shareholdersequity: "totalEquity",
  stockholdersequity: "totalEquity",
  totalstockholdersequity: "totalEquity",
  
  // Cash Flow
  operatingcashflow: "operatingCashFlow",
  cashfromoperatingactivities: "operatingCashFlow",
  ocf: "operatingCashFlow",
  
  capex: "capex",
  capitalexpenditure: "capex",
  capitalexpenditures: "capex",
  additions_to_ppe: "capex",
  
  financingcashflow: "financingCashFlow",
  cashfromfinancingactivities: "financingCashFlow",
  
  investingcashflow: "investingCashFlow",
  cashfrominvestingactivities: "investingCashFlow",
  
  freecashflow: "freeCashFlow",
  fcf: "freeCashFlow"
};

const KEY_LABELS: { [key in keyof PeriodData]?: string } = {
  revenue: "Total Revenue",
  cogs: "Cost of Goods Sold (COGS)",
  grossProfit: "Gross Profit",
  opex: "Operating Expenses (OPEX)",
  ebitda: "EBITDA",
  ebit: "Operating Income (EBIT)",
  interestExpense: "Interest Expense",
  taxExpense: "Income Tax Expense",
  netIncome: "Net Income",
  cashAndEquivalents: "Cash & Equivalents",
  accountsReceivable: "Accounts Receivable",
  inventory: "Inventory Assets",
  totalCurrentAssets: "Total Current Assets",
  ppe: "Property, Plant & Equipment",
  totalAssets: "Total Assets",
  accountsPayable: "Accounts Payable",
  shortTermDebt: "Short-Term Debt",
  totalCurrentLiabilities: "Total Current Liabilities",
  longTermDebt: "Long-Term Debt",
  totalLiabilities: "Total Liabilities",
  totalEquity: "Total Stockholders' Equity",
  operatingCashFlow: "Operating Cash Flow",
  capex: "Capital Expenditures (CapEx)",
  freeCashFlow: "Free Cash Flow"
};

export default function UploadSection({ samples, financials, onUpdateFinancials, isLoadingAi }: UploadSectionProps) {
  const [activePresetTab, setActivePresetTab] = useState<string>(financials.ticker);
  const [activeStatementTab, setActiveStatementTab] = useState<"IS" | "BS" | "CF">("IS");
  const [activePeriodIndex, setActivePeriodIndex] = useState<number>(0);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // Audits & Errors & Success Messaging states
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadWarnings, setUploadWarnings] = useState<string[]>([]);
  
  // Conflict / Duplicate detection states
  const [conflictMode, setConflictMode] = useState<boolean>(false);
  const [conflictYears, setConflictYears] = useState<string[]>([]);
  const [pendingFinancials, setPendingFinancials] = useState<CompanyFinancials | null>(null);

  const activePeriod = financials.periods[activePeriodIndex] || financials.periods[0];

  const handleSelectPreset = (ticker: string) => {
    const selected = samples.find((s) => s.ticker === ticker);
    if (selected) {
      setActivePresetTab(ticker);
      onUpdateFinancials(JSON.parse(JSON.stringify(selected))); // Deep copy
      setActivePeriodIndex(0);
      setUploadError(null);
      setUploadSuccess(null);
      setUploadWarnings([]);
      setConflictMode(false);
    }
  };

  const handleUpdateField = (field: keyof PeriodData, value: number | string) => {
    const updatedPeriods = [...financials.periods];
    const updatedPeriod = { ...updatedPeriods[activePeriodIndex] };

    if (field === "year") {
      updatedPeriod.year = String(value);
    } else {
      updatedPeriod[field] = Number(value) || 0;
    }

    // Auto-compute basic subtotals to behave like a smart spreadsheet
    if (field === "revenue" || field === "cogs") {
      updatedPeriod.grossProfit = updatedPeriod.revenue - updatedPeriod.cogs;
    }
    if (field === "grossProfit" || field === "opex") {
      updatedPeriod.ebitda = updatedPeriod.grossProfit - updatedPeriod.opex;
      updatedPeriod.ebit = updatedPeriod.ebitda - (updatedPeriod.opex * 0.1); // assume 10% depreciation approximation if not input
    }
    if (field === "ebit" || field === "interestExpense" || field === "taxExpense") {
      updatedPeriod.netIncome = updatedPeriod.ebit - updatedPeriod.interestExpense - updatedPeriod.taxExpense;
    }
    if (field === "cashAndEquivalents" || field === "accountsReceivable" || field === "inventory") {
      updatedPeriod.totalCurrentAssets = updatedPeriod.cashAndEquivalents + updatedPeriod.accountsReceivable + updatedPeriod.inventory;
    }
    if (field === "accountsPayable" || field === "shortTermDebt") {
      updatedPeriod.totalCurrentLiabilities = updatedPeriod.accountsPayable + updatedPeriod.shortTermDebt;
    }
    if (field === "totalCurrentAssets" || field === "ppe") {
      updatedPeriod.totalAssets = updatedPeriod.totalCurrentAssets + updatedPeriod.ppe;
    }
    if (field === "totalCurrentLiabilities" || field === "longTermDebt") {
      updatedPeriod.totalLiabilities = updatedPeriod.totalCurrentLiabilities + updatedPeriod.longTermDebt;
    }
    if (field === "totalAssets" || field === "totalLiabilities") {
      updatedPeriod.totalEquity = updatedPeriod.totalAssets - updatedPeriod.totalLiabilities;
    }
    if (field === "operatingCashFlow" || field === "capex") {
      updatedPeriod.freeCashFlow = updatedPeriod.operatingCashFlow - updatedPeriod.capex;
    }

    updatedPeriods[activePeriodIndex] = updatedPeriod;
    onUpdateFinancials({
      ...financials,
      periods: updatedPeriods
    });
  };

  const handleAddPeriod = () => {
    const latestYear = financials.periods.length > 0 
      ? Number(financials.periods[financials.periods.length - 1].year) 
      : 2024;
    const newPeriod: PeriodData = {
      ...EMPTY_PERIOD_TEMPLATE,
      year: String(latestYear + 1)
    };
    onUpdateFinancials({
      ...financials,
      periods: [...financials.periods, newPeriod]
    });
    setActivePeriodIndex(financials.periods.length);
  };

  const handleRemovePeriod = (index: number) => {
    if (financials.periods.length <= 1) return; // Must have at least one period
    const updated = financials.periods.filter((_, idx) => idx !== index);
    onUpdateFinancials({
      ...financials,
      periods: updated
    });
    setActivePeriodIndex(0);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    setUploadSuccess(null);
    setUploadWarnings([]);
    setConflictMode(false);

    if (!file) {
      setUploadError("No file was selected. Please choose a file.");
      return;
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (fileExt !== "json" && fileExt !== "csv" && fileExt !== "xlsx") {
      setUploadError("File type validation failed. Only standard CSV, Excel (.xlsx), and JSON formats are supported.");
      return;
    }

    if (file.size === 0) {
      setUploadError("File validation failed: The uploaded file is empty (0 bytes).");
      return;
    }

    const reader = new FileReader();

    if (fileExt === "json") {
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsed = JSON.parse(text);
          if (parsed.companyName && parsed.periods && parsed.periods.length > 0) {
            
            // Check for duplicate / year collisions
            const existingYears = financials.periods.map(p => p.year);
            const uploadedYears = parsed.periods.map((p: any) => String(p.year));
            const overlaps = uploadedYears.filter((y: string) => existingYears.includes(y));

            if (overlaps.length > 0) {
              setPendingFinancials(parsed);
              setConflictYears(overlaps);
              setConflictMode(true);
            } else {
              onUpdateFinancials(parsed);
              setUploadSuccess(`Statements parsed successfully! Loaded ${parsed.companyName} with periods: ${uploadedYears.join(", ")}.`);
              setActivePresetTab("CUSTOM");
              setActivePeriodIndex(0);
            }
          } else {
            throw new Error("Validation Error: JSON file is missing companyName or periods properties.");
          }
        } catch (err: any) {
          setUploadError(err.message || "Invalid JSON syntax inside file.");
        }
      };
      reader.readAsText(file);
    } else {
      // CSV or XLSX
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          
          const periodsMap: { [year: string]: Partial<PeriodData> } = {};
          const foundYearsSet = new Set<string>();
          const sheetNamesParsed: string[] = [];
          const missingKeyWarnings: string[] = [];
          
          workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            if (rows.length === 0) return;
            sheetNamesParsed.push(sheetName);
            
            // Scan header row containing 4-digit years (columns 1 to end)
            let headerRowIndex = -1;
            let yearsInHeader: { year: string; colIndex: number }[] = [];
            
            for (let r = 0; r < Math.min(rows.length, 15); r++) {
              const row = rows[r];
              if (!row || row.length < 2) continue;
              
              const parsedYears: { year: string; colIndex: number }[] = [];
              for (let c = 1; c < row.length; c++) {
                const rawVal = row[c];
                if (rawVal === undefined || rawVal === null) continue;
                const val = String(rawVal).trim().replace(/"/g, "");
                if (val && /^\d{4}$/.test(val)) {
                  parsedYears.push({ year: val, colIndex: c });
                }
              }
              if (parsedYears.length > 0) {
                headerRowIndex = r;
                yearsInHeader = parsedYears;
                break;
              }
            }
            
            if (headerRowIndex === -1 || yearsInHeader.length === 0) {
              return;
            }
            
            // Scan all subsequent rows below the detected header for metrics
            for (let r = headerRowIndex + 1; r < rows.length; r++) {
              const row = rows[r];
              if (!row || row.length === 0) continue;
              
              const rawMetricName = String(row[0] || "").trim();
              if (!rawMetricName) continue;
              
              const normalizedMetricKey = rawMetricName.toLowerCase().replace(/[^a-z0-9]/g, "");
              const mappedKey = KEY_MAPPINGS[normalizedMetricKey];
              
              if (mappedKey) {
                yearsInHeader.forEach(({ year, colIndex }) => {
                  foundYearsSet.add(year);
                  if (!periodsMap[year]) {
                    periodsMap[year] = { year };
                  }
                  
                  const cellValue = row[colIndex];
                  if (cellValue !== undefined && cellValue !== null && cellValue !== "") {
                    let numVal = 0;
                    if (typeof cellValue === "number") {
                      numVal = cellValue;
                    } else {
                      numVal = parseFloat(String(cellValue).replace(/[^0-9.-]/g, ""));
                    }
                    if (!isNaN(numVal)) {
                      (periodsMap[year] as any)[mappedKey] = numVal;
                    }
                  }
                });
              }
            }
          });
          
          if (foundYearsSet.size === 0) {
            throw new Error("Could not find any years (e.g., 2023, 2024) in the spreadsheet headers. Verify the headers occupy the first columns.");
          }
          
          // Formulate PeriodData array and compute sub-totals/ratios
          const newPeriods: PeriodData[] = Object.values(periodsMap).map((p: any) => {
            const completePeriod = { ...EMPTY_PERIOD_TEMPLATE, ...p };
            
            // Recompute core formulas
            completePeriod.grossProfit = completePeriod.revenue - completePeriod.cogs;
            completePeriod.ebitda = completePeriod.grossProfit - completePeriod.opex;
            if (completePeriod.ebit === 0 || completePeriod.ebit === EMPTY_PERIOD_TEMPLATE.ebit) {
              completePeriod.ebit = completePeriod.ebitda - (completePeriod.opex * 0.1);
            }
            completePeriod.netIncome = completePeriod.ebit - completePeriod.interestExpense - completePeriod.taxExpense;
            completePeriod.totalCurrentAssets = completePeriod.cashAndEquivalents + completePeriod.accountsReceivable + completePeriod.inventory;
            completePeriod.totalAssets = completePeriod.totalCurrentAssets + completePeriod.ppe;
            completePeriod.totalCurrentLiabilities = completePeriod.accountsPayable + completePeriod.shortTermDebt;
            completePeriod.totalLiabilities = completePeriod.totalCurrentLiabilities + completePeriod.longTermDebt;
            completePeriod.totalEquity = completePeriod.totalAssets - completePeriod.totalLiabilities;
            completePeriod.freeCashFlow = completePeriod.operatingCashFlow - completePeriod.capex;
            
            return completePeriod as PeriodData;
          });
          
          // Quality Audit checklist
          const criticalKeys: (keyof PeriodData)[] = ["revenue", "netIncome", "cashAndEquivalents", "totalAssets", "operatingCashFlow"];
          newPeriods.forEach(p => {
            criticalKeys.forEach(k => {
              if (p[k] === 0 || p[k] === undefined) {
                missingKeyWarnings.push(`[${p.year} audit]: Item "${KEY_LABELS[k] || String(k)}" was not detected or parsed as 0.`);
              }
            });
          });
          
          setUploadWarnings(missingKeyWarnings);
          
          const finalTicker = "UPLOADED";
          const finalCompanyName = file.name.split(".")[0]?.replace(/[_-]/g, " ") || "Custom Financials";
          
          const finalFinancials: CompanyFinancials = {
            companyName: finalCompanyName,
            ticker: finalTicker,
            sector: "Corporate / General",
            periods: newPeriods.sort((a, b) => Number(a.year) - Number(b.year))
          };
          
          // Collision and duplicate check
          const existingYears = financials.periods.map(p => p.year);
          const uploadedYears = finalFinancials.periods.map(p => p.year);
          const overlaps = uploadedYears.filter(y => existingYears.includes(y));
          
          if (overlaps.length > 0) {
            setPendingFinancials(finalFinancials);
            setConflictYears(overlaps);
            setConflictMode(true);
          } else {
            onUpdateFinancials(finalFinancials);
            setUploadSuccess(`Successfully parsed ${file.name}! Loaded ${uploadedYears.length} periods: ${uploadedYears.join(", ")}.`);
            setActivePresetTab("CUSTOM");
            setActivePeriodIndex(0);
          }
          
        } catch (err: any) {
          console.error(err);
          setUploadError(err.message || "An error occurred while compiling statements.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleResolveConflict = (resolution: "OVERWRITE" | "MERGE" | "CANCEL") => {
    if (!pendingFinancials) return;
    
    if (resolution === "OVERWRITE") {
      onUpdateFinancials(pendingFinancials);
      setUploadSuccess(`Uploaded company successfully, replacing existing records with ${pendingFinancials.periods.map(p => p.year).join(", ")}.`);
      setActivePresetTab("CUSTOM");
      setActivePeriodIndex(0);
    } else if (resolution === "MERGE") {
      const uploadedYearStrings = pendingFinancials.periods.map(p => p.year);
      const remainingExisting = financials.periods.filter(p => !uploadedYearStrings.includes(p.year));
      const mergedPeriods = [...remainingExisting, ...pendingFinancials.periods].sort((a, b) => Number(a.year) - Number(b.year));
      
      onUpdateFinancials({
        ...financials,
        periods: mergedPeriods,
        companyName: pendingFinancials.companyName || financials.companyName,
        ticker: pendingFinancials.ticker || financials.ticker,
        sector: pendingFinancials.sector || financials.sector
      });
      setUploadSuccess(`Merged successfully. Combined timeline contains: ${mergedPeriods.map(p => p.year).join(", ")}.`);
      setActivePresetTab("CUSTOM");
      setActivePeriodIndex(0);
    }
    
    setConflictMode(false);
    setPendingFinancials(null);
    setConflictYears([]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div id="upload-section" className="bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl">
      {/* Platform Title Banner */}
      <div className="p-6 bg-gradient-to-r from-zinc-900 to-zinc-950 border-b border-zinc-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-sm font-mono font-bold tracking-wider text-indigo-400 uppercase">STEP 1 • INPUT WORKSPACE</h2>
          </div>
          <h1 className="text-xl font-sans font-bold text-white tracking-tight">Load & Audit Financial Statements</h1>
          <p className="text-xs text-zinc-400 mt-1">Select a real enterprise benchmark, drag and drop standard CSV outputs, or edit manual accounts instantly.</p>
        </div>
        
        {/* Preset Selector Pill-List */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl max-w-max">
          {samples.map((s) => (
            <button
              key={s.ticker}
              onClick={() => handleSelectPreset(s.ticker)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all ${
                activePresetTab === s.ticker && financials.ticker === s.ticker
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {s.companyName} ({s.ticker})
            </button>
          ))}
          {activePresetTab === "CUSTOM" && (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-900/40 text-emerald-400 font-mono text-xs font-semibold">
              Custom Uploaded
            </span>
          )}
        </div>
      </div>

      {/* Workspace Inner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Drag/Drop and Period Controller */}
        <div className="p-6 lg:col-span-4 border-r border-zinc-850 flex flex-col justify-between gap-6">
          <div className="space-y-6">
            
            {/* Real Drag & Drop Zone or Conflict Resolution or Success States */}
            {conflictMode ? (
              <div id="duplicate-conflict-panel" className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-5 text-left space-y-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-sans font-bold text-amber-400">Duplicate Year Conflict</h4>
                    <p className="text-[10px] text-zinc-400 leading-relaxed mt-1">
                      The uploaded file contains financial records for year(s) <span className="font-mono font-bold text-white bg-amber-950 border border-amber-900/50 px-1.5 py-0.5 rounded">{conflictYears.join(", ")}</span> which already exist in your active workspace.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    id="conflict-merge-btn"
                    onClick={() => handleResolveConflict("MERGE")}
                    className="w-full text-left bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-[10px] font-medium text-white px-3 py-2 rounded-lg flex items-center justify-between group transition-all cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-indigo-400 block">Merge (Overwrite overlaps)</span>
                      <span className="text-[9px] text-zinc-500 block">Keep unique periods, update overlapping ones.</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-white transition-all" />
                  </button>

                  <button
                    id="conflict-overwrite-btn"
                    onClick={() => handleResolveConflict("OVERWRITE")}
                    className="w-full text-left bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-[10px] font-medium text-white px-3 py-2 rounded-lg flex items-center justify-between group transition-all cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-amber-500 block">Replace All records</span>
                      <span className="text-[9px] text-zinc-500 block">Discard existing periods and load only new ones.</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-white transition-all" />
                  </button>
                  
                  <button
                    id="conflict-cancel-btn"
                    onClick={() => {
                      setConflictMode(false);
                      setPendingFinancials(null);
                      setConflictYears([]);
                    }}
                    className="w-full text-center bg-zinc-950 border border-zinc-900 hover:border-zinc-850 text-[10px] font-mono text-zinc-400 hover:text-white py-1.5 rounded transition-all cursor-pointer"
                  >
                    Cancel Upload
                  </button>
                </div>
              </div>
            ) : uploadSuccess ? (
              <div id="upload-success-panel" className="bg-emerald-950/15 border border-emerald-900/50 rounded-xl p-5 text-left space-y-4 animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-sans font-bold text-emerald-400">Ingestion Complete</h4>
                    <p className="text-[10px] text-zinc-300 leading-relaxed mt-1">
                      {uploadSuccess}
                    </p>
                  </div>
                </div>

                {uploadWarnings.length > 0 && (
                  <div className="space-y-1.5 bg-zinc-900/60 border border-zinc-850 p-2.5 rounded-lg max-h-[140px] overflow-y-auto">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase block tracking-wider">Quality Audit Log ({uploadWarnings.length})</span>
                    <ul className="space-y-1">
                      {uploadWarnings.map((warn, index) => (
                        <li key={index} className="text-[9px] font-mono text-zinc-400 flex items-start gap-1">
                          <span className="text-amber-500">•</span>
                          <span>{warn}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  id="dismiss-success-btn"
                  onClick={() => {
                    setUploadSuccess(null);
                    setUploadWarnings([]);
                  }}
                  className="w-full text-center bg-emerald-950 border border-emerald-900/60 hover:bg-emerald-900/40 text-emerald-400 font-mono text-xs py-2 rounded-lg font-bold transition-all cursor-pointer"
                >
                  Load Another Statement File
                </button>
              </div>
            ) : (
              <div
                id="file-drag-zone"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border border-dashed rounded-xl p-6 text-center transition-all ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-950/20"
                    : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50"
                }`}
              >
                <input
                  type="file"
                  id="file-upload-input"
                  className="hidden"
                  accept=".json,.csv,.xlsx"
                  onChange={handleFileInput}
                />
                <label htmlFor="file-upload-input" className="cursor-pointer block">
                  <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-3" />
                  <span className="text-xs font-sans font-medium text-zinc-200 block">
                    Drag & drop CSV / Excel / JSON
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                    or click to browse local files
                  </span>
                </label>

                {uploadError && (
                  <div className="mt-3 p-2.5 bg-red-950/30 border border-red-900/50 rounded-lg flex items-start gap-2 text-left">
                    <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-mono text-red-400">{uploadError}</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick CSV Template Guidelines Tooltip */}
            <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl space-y-2">
              <h4 className="font-mono text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-zinc-500" />
                CSV Format Support
              </h4>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                We support structured row CSV exports. The first row should contain years <code className="bg-zinc-900 border border-zinc-800 text-indigo-400 px-1 rounded">2023, 2024</code>. Succeeding rows should begin with standard account titles (e.g. <code className="text-zinc-300">Revenue, COGS, Cash, Long-Term Debt, Capex</code>).
              </p>
            </div>

            {/* Company Profiler Card */}
            <div className="bg-zinc-900/20 border border-zinc-850 p-4 rounded-xl space-y-3">
              <div className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Target Entity Details</div>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-mono text-zinc-500">Corporate Entity Name</label>
                  <input
                    type="text"
                    value={financials.companyName}
                    onChange={(e) => onUpdateFinancials({ ...financials, companyName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white font-sans focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500">Ticker/Symbol</label>
                    <input
                      type="text"
                      value={financials.ticker}
                      onChange={(e) => onUpdateFinancials({ ...financials, ticker: e.target.value.toUpperCase() })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white font-sans focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-500">Industry / Sector</label>
                    <input
                      type="text"
                      value={financials.sector}
                      onChange={(e) => onUpdateFinancials({ ...financials, sector: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-white font-sans focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Years Timeline */}
          <div className="space-y-3 border-t border-zinc-850 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Analysis Years ({financials.periods.length})</span>
              <button
                onClick={handleAddPeriod}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-zinc-900 hover:bg-zinc-850 px-2 py-1 rounded border border-zinc-800 transition-all"
              >
                <Plus className="h-3 w-3" /> Add Year
              </button>
            </div>

            <div className="space-y-1.5">
              {financials.periods.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePeriodIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                    activePeriodIndex === idx
                      ? "bg-indigo-950/30 border border-indigo-900/60 text-white"
                      : "bg-zinc-900/40 border border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className={`h-4 w-4 ${activePeriodIndex === idx ? "text-indigo-400" : "text-zinc-500"}`} />
                    <div>
                      <span className="font-mono text-xs font-bold block">{p.year} Period</span>
                      <span className="text-[10px] font-sans text-zinc-500 block">Rev: {formatCurrency(p.revenue)} • Net Inc: {formatCurrency(p.netIncome)}</span>
                    </div>
                  </div>
                  {financials.periods.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePeriod(idx);
                      }}
                      className="p-1 hover:bg-red-950/50 hover:text-red-400 rounded transition-all text-zinc-600"
                      title="Delete Period"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Spreadsheet Ledger Input Sheets */}
        <div className="lg:col-span-8 flex flex-col min-h-[450px]">
          {/* Statement Tabs */}
          <div className="border-b border-zinc-850 bg-zinc-900/40 px-6 py-2 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveStatementTab("IS")}
                className={`px-4 py-2 font-mono text-xs font-semibold rounded-lg transition-all ${
                  activeStatementTab === "IS"
                    ? "bg-zinc-950 border border-zinc-850 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Income Statement
              </button>
              <button
                onClick={() => setActiveStatementTab("BS")}
                className={`px-4 py-2 font-mono text-xs font-semibold rounded-lg transition-all ${
                  activeStatementTab === "BS"
                    ? "bg-zinc-950 border border-zinc-850 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Balance Sheet
              </button>
              <button
                onClick={() => setActiveStatementTab("CF")}
                className={`px-4 py-2 font-mono text-xs font-semibold rounded-lg transition-all ${
                  activeStatementTab === "CF"
                    ? "bg-zinc-950 border border-zinc-850 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Cash Flow Statement
              </button>
            </div>
            
            {/* Statement Year Input Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">EDIT YEAR:</span>
              <input
                type="text"
                value={activePeriod?.year || ""}
                onChange={(e) => handleUpdateField("year", e.target.value)}
                className="w-14 bg-zinc-950 border border-zinc-850 rounded text-center py-0.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Table Spreadsheet Body */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left font-sans border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-850">
                  <th className="p-3 pl-6 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Financial Line Item</th>
                  <th className="p-3 pl-6 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-wider text-right w-[200px]">Exact Dollar Amount ($)</th>
                  <th className="p-3 pl-6 font-mono text-[10px] uppercase font-bold text-zinc-500 tracking-wider w-[240px]">Calculation / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {activeStatementTab === "IS" && (
                  <>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Total Revenue</td>
                      <td className="p-2"><input type="number" value={activePeriod?.revenue || 0} onChange={(e) => handleUpdateField("revenue", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Topline revenue, sales volume.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Cost of Goods Sold (COGS)</td>
                      <td className="p-2"><input type="number" value={activePeriod?.cogs || 0} onChange={(e) => handleUpdateField("cogs", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Direct manufacturing or serving costs.</td>
                    </tr>
                    <tr className="bg-indigo-950/10 hover:bg-indigo-950/20 font-bold">
                      <td className="p-3 pl-6 text-indigo-300">Gross Profit</td>
                      <td className="p-3 text-right font-mono text-indigo-400">{formatCurrency(activePeriod?.grossProfit || 0)}</td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-400 font-mono">Revenue - COGS</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Operating Expenses (OPEX)</td>
                      <td className="p-2"><input type="number" value={activePeriod?.opex || 0} onChange={(e) => handleUpdateField("opex", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">SG&A, R&D, administrative costs.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Operating Cash Profit (EBITDA)</td>
                      <td className="p-2"><input type="number" value={activePeriod?.ebitda || 0} onChange={(e) => handleUpdateField("ebitda", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Earnings before Interest, Taxes, D&A.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Operating Income (EBIT)</td>
                      <td className="p-2"><input type="number" value={activePeriod?.ebit || 0} onChange={(e) => handleUpdateField("ebit", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Operating Profitability indicator.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Interest Expenses</td>
                      <td className="p-2"><input type="number" value={activePeriod?.interestExpense || 0} onChange={(e) => handleUpdateField("interestExpense", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Financing costs on debt loading.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Income Tax Expense</td>
                      <td className="p-2"><input type="number" value={activePeriod?.taxExpense || 0} onChange={(e) => handleUpdateField("taxExpense", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Corporate tax provisions.</td>
                    </tr>
                    <tr className="bg-emerald-950/15 hover:bg-emerald-950/25 font-bold">
                      <td className="p-3 pl-6 text-emerald-400">Net Income (Earnings)</td>
                      <td className="p-3 text-right font-mono text-emerald-400">{formatCurrency(activePeriod?.netIncome || 0)}</td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-400 font-mono">EBIT - Interest - Tax</td>
                    </tr>
                  </>
                )}

                {activeStatementTab === "BS" && (
                  <>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Cash & Equivalents</td>
                      <td className="p-2"><input type="number" value={activePeriod?.cashAndEquivalents || 0} onChange={(e) => handleUpdateField("cashAndEquivalents", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Liquid checking, cash reserves.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Accounts Receivable</td>
                      <td className="p-2"><input type="number" value={activePeriod?.accountsReceivable || 0} onChange={(e) => handleUpdateField("accountsReceivable", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Uncollected client bills.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Inventory Assets</td>
                      <td className="p-2"><input type="number" value={activePeriod?.inventory || 0} onChange={(e) => handleUpdateField("inventory", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Raw materials & unsold stock.</td>
                    </tr>
                    <tr className="bg-zinc-900/60 hover:bg-zinc-900/80 font-bold">
                      <td className="p-3 pl-6 text-zinc-300">Total Current Assets</td>
                      <td className="p-2"><input type="number" value={activePeriod?.totalCurrentAssets || 0} onChange={(e) => handleUpdateField("totalCurrentAssets", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Cash + Receivables + Inventories.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Property, Plant & Equipment (Net PPE)</td>
                      <td className="p-2"><input type="number" value={activePeriod?.ppe || 0} onChange={(e) => handleUpdateField("ppe", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Fixed capital machinery or real estate.</td>
                    </tr>
                    <tr className="bg-zinc-900 hover:bg-zinc-900 font-bold border-b border-zinc-850">
                      <td className="p-3 pl-6 text-white">Total Assets</td>
                      <td className="p-3 text-right font-mono text-white">{formatCurrency(activePeriod?.totalAssets || 0)}</td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-400 font-mono">Current Assets + PPE</td>
                    </tr>

                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Accounts Payable</td>
                      <td className="p-2"><input type="number" value={activePeriod?.accountsPayable || 0} onChange={(e) => handleUpdateField("accountsPayable", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Supplier invoices owed.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Short-Term Debt</td>
                      <td className="p-2"><input type="number" value={activePeriod?.shortTermDebt || 0} onChange={(e) => handleUpdateField("shortTermDebt", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Debt payments due within 1 year.</td>
                    </tr>
                    <tr className="bg-zinc-900/60 hover:bg-zinc-900/80 font-bold">
                      <td className="p-3 pl-6 text-zinc-300">Total Current Liabilities</td>
                      <td className="p-2"><input type="number" value={activePeriod?.totalCurrentLiabilities || 0} onChange={(e) => handleUpdateField("totalCurrentLiabilities", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Payables + Short Term Debt.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Long-Term Debt</td>
                      <td className="p-2"><input type="number" value={activePeriod?.longTermDebt || 0} onChange={(e) => handleUpdateField("longTermDebt", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Long term bonds, bank facility draws.</td>
                    </tr>
                    <tr className="bg-zinc-900 hover:bg-zinc-900 font-bold border-b border-zinc-850">
                      <td className="p-3 pl-6 text-white">Total Liabilities</td>
                      <td className="p-2"><input type="number" value={activePeriod?.totalLiabilities || 0} onChange={(e) => handleUpdateField("totalLiabilities", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Current Liabilities + Long-Term Debt.</td>
                    </tr>

                    <tr className="bg-indigo-950/15 hover:bg-indigo-950/25 font-bold">
                      <td className="p-3 pl-6 text-indigo-300">Total Stockholders' Equity</td>
                      <td className="p-3 text-right font-mono text-indigo-400">{formatCurrency(activePeriod?.totalEquity || 0)}</td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-400 font-mono">Total Assets - Liabilities</td>
                    </tr>
                  </>
                )}

                {activeStatementTab === "CF" && (
                  <>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Operating Cash Flow (OCF)</td>
                      <td className="p-2"><input type="number" value={activePeriod?.operatingCashFlow || 0} onChange={(e) => handleUpdateField("operatingCashFlow", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Cash generated from core business.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Capital Expenditures (CapEx)</td>
                      <td className="p-2"><input type="number" value={activePeriod?.capex || 0} onChange={(e) => handleUpdateField("capex", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Purchases of property & fixed assets.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Investing Cash Flow</td>
                      <td className="p-2"><input type="number" value={activePeriod?.investingCashFlow || 0} onChange={(e) => handleUpdateField("investingCashFlow", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Liquid business investments, acquisitions.</td>
                    </tr>
                    <tr className="hover:bg-zinc-900/20">
                      <td className="p-3 pl-6 font-medium text-zinc-300">Financing Cash Flow</td>
                      <td className="p-2"><input type="number" value={activePeriod?.financingCashFlow || 0} onChange={(e) => handleUpdateField("financingCashFlow", e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded px-2.5 py-1.5 text-right font-mono text-white focus:outline-none focus:border-indigo-500" /></td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-500 italic">Dividends, buybacks, debt issuances.</td>
                    </tr>
                    <tr className="bg-emerald-950/15 hover:bg-emerald-950/25 font-bold">
                      <td className="p-3 pl-6 text-emerald-400">Free Cash Flow (FCF)</td>
                      <td className="p-3 text-right font-mono text-emerald-400">{formatCurrency(activePeriod?.freeCashFlow || 0)}</td>
                      <td className="p-3 pl-6 text-[11px] text-zinc-400 font-mono">Operating Cash Flow - CapEx</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
