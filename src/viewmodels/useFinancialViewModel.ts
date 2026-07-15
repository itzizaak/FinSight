/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { CompanyFinancials, FinancialRatios, AiInsights } from "../types";
import { calculateRatios } from "../utils";
import { logger, LogEntry } from "../services/logger";

export interface AnalysisSettings {
  targetCurrentRatio: number;
  maxDebtToEquity: number;
  taxStandardizationRate: number; // %
  accentColor: "indigo" | "emerald" | "violet" | "rose" | "cyan";
  currencySymbol: "$" | "€" | "£" | "¥";
}

const DEFAULT_SETTINGS: AnalysisSettings = {
  targetCurrentRatio: 2.0,
  maxDebtToEquity: 1.5,
  taxStandardizationRate: 21,
  accentColor: "indigo",
  currencySymbol: "$"
};

export function useFinancialViewModel(initialSamples: CompanyFinancials[]) {
  // Navigation & Screen View State
  const [activeTab, setActiveTab] = useState<"HOME" | "INPUT" | "RATIOS" | "CHARTS" | "AI" | "REPORT" | "SETTINGS">("HOME");
  
  // Financial Statement States
  const [samples, setSamples] = useState<CompanyFinancials[]>(initialSamples);
  const [financials, setFinancials] = useState<CompanyFinancials>(
    initialSamples.length > 0 ? JSON.parse(JSON.stringify(initialSamples[0])) : {
      companyName: "Placeholder Inc.",
      ticker: "PLCH",
      sector: "Sector / Industry",
      periods: []
    }
  );

  // AI & Analysis Insights
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // App settings & custom configurations
  const [settings, setSettings] = useState<AnalysisSettings>(() => {
    const saved = localStorage.getItem("finsight_settings");
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  // Reactive Application Log State
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // 1. Subscribe to Live Logs on mount
  useEffect(() => {
    setLogs(logger.getLogs());
    const unsubscribe = logger.subscribe(() => {
      setLogs(logger.getLogs());
    });
    
    logger.success("ViewModel", "FinSight Cognitive Dashboard ViewModel initialized.");
    return unsubscribe;
  }, []);

  // 2. Persist Settings in LocalStorage
  useEffect(() => {
    localStorage.setItem("finsight_settings", JSON.stringify(settings));
  }, [settings]);

  // 3. Fetch remote financial presets if available
  useEffect(() => {
    const loadBackendPresets = async () => {
      try {
        logger.info("ViewModel", "Attempting to query system comparative benchmarks from /api/samples...");
        const res = await fetch("/api/samples");
        const json = await res.json();
        if (json.status === "success" && json.data) {
          setSamples(json.data);
          const matched = json.data.find((s: CompanyFinancials) => s.ticker === "AAPL") || json.data[0];
          setFinancials(JSON.parse(JSON.stringify(matched)));
          logger.success("ViewModel", `Successfully loaded ${json.data.length} benchmark items from backend storage.`);
        }
      } catch (err: any) {
        logger.warn("ViewModel", "Could not locate comparative backend. Defaulting to pre-compiled local statement models.", { error: err.message });
      }
    };
    loadBackendPresets();
  }, []);

  // 4. Derive ratios reactively
  const calculatedRatios = useMemo<FinancialRatios[]>(() => {
    if (!financials || !financials.periods) return [];
    logger.info("ViewModel", `Deriving ratio series for ${financials.companyName} across ${financials.periods.length} periods.`);
    return financials.periods.map((p) => {
      // Pass-through standard calculation
      const baseRatios = calculateRatios(p);
      return baseRatios;
    });
  }, [financials]);

  // 5. Actions / Mutators
  const selectCompanyByTicker = (ticker: string) => {
    const target = samples.find((s) => s.ticker === ticker);
    if (target) {
      setFinancials(JSON.parse(JSON.stringify(target)));
      setAiInsights(null); // Clear old cached insights when company changes
      logger.success("ViewModel", `Active company context switched to ${target.companyName} (${target.ticker}).`);
    } else {
      logger.error("ViewModel", `Could not find company preset with ticker: ${ticker}`);
    }
  };

  const updateActiveFinancials = (updatedData: CompanyFinancials) => {
    setFinancials(updatedData);
    setAiInsights(null); // Reset cognitive insights as the base statements changed
    logger.success("ViewModel", `Corporate balance sheet records updated for ${updatedData.companyName}. Ratios recalculated.`);
  };

  const updateSettings = (partialSettings: Partial<AnalysisSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...partialSettings };
      logger.info("ViewModel", "Analytical assumption constraints updated.", partialSettings);
      return merged;
    });
  };

  const triggerStatementAnalysis = async () => {
    setIsLoadingAi(true);
    logger.info("ViewModel", `Initiating Gemini AI cognitive analysis for ${financials.companyName}...`);

    try {
      const res = await fetch("/api/analyze-statement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyFinancials: financials, ratios: calculatedRatios })
      });

      const json = await res.json();
      if (json.status === "success" && json.analysis) {
        setAiInsights(json.analysis);
        logger.success("ViewModel", `Gemini model analysis completed for ${financials.companyName}. Insights extracted.`);
      } else if (json.error === "GEMINI_API_KEY_MISSING") {
        logger.error("ViewModel", "Ingestion halted: GEMINI_API_KEY environment secret is unconfigured.");
        throw new Error("GEMINI_API_KEY_MISSING");
      } else {
        logger.error("ViewModel", "Ingestion failed during server computation.", json);
        throw new Error(json.message || "Failed to analyze statements.");
      }
    } catch (err: any) {
      logger.error("ViewModel", "Connection error during AI statement evaluation.", { error: err.message });
      throw err;
    } finally {
      setIsLoadingAi(false);
    }
  };

  const clearSystemLogs = () => {
    logger.clearLogs();
  };

  return {
    // States
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

    // Actions
    selectCompanyByTicker,
    updateActiveFinancials,
    updateSettings,
    triggerStatementAnalysis,
    clearSystemLogs
  };
}
