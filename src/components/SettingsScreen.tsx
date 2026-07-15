/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Settings, 
  Terminal, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  RefreshCw,
  Sliders,
  DollarSign,
  Palette,
  Server,
  Globe
} from "lucide-react";
import { AnalysisSettings } from "../viewmodels/useFinancialViewModel";
import { LogEntry } from "../services/logger";
import { Card, CardHeader, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

interface SettingsScreenProps {
  settings: AnalysisSettings;
  logs: LogEntry[];
  onUpdateSettings: (settings: Partial<AnalysisSettings>) => void;
  onClearLogs: () => void;
}

export default function SettingsScreen({
  settings,
  logs,
  onUpdateSettings,
  onClearLogs
}: SettingsScreenProps) {
  const [filterLevel, setFilterLevel] = useState<"ALL" | "INFO" | "WARN" | "ERROR" | "SUCCESS">("ALL");
  const [serverStatus, setServerStatus] = useState<"idle" | "checking" | "online" | "offline">("idle");
  const [serverPing, setServerPing] = useState<number | null>(null);

  const checkServerStatus = async () => {
    setServerStatus("checking");
    const start = Date.now();
    try {
      const res = await fetch("/api/health");
      const json = await res.json();
      if (json.status === "ok") {
        setServerStatus("online");
        setServerPing(Date.now() - start);
      } else {
        setServerStatus("offline");
      }
    } catch (err) {
      setServerStatus("offline");
    }
  };

  // Filter logs reactively
  const filteredLogs = logs.filter((log) => {
    if (filterLevel === "ALL") return true;
    return log.level.toUpperCase() === filterLevel;
  });

  const colors = [
    { name: "Indigo", value: "indigo" as const, bg: "bg-indigo-600" },
    { name: "Emerald", value: "emerald" as const, bg: "bg-emerald-600" },
    { name: "Violet", value: "violet" as const, bg: "bg-violet-600" },
    { name: "Rose", value: "rose" as const, bg: "bg-rose-600" },
    { name: "Cyan", value: "cyan" as const, bg: "bg-cyan-600" }
  ];

  const currencies = [
    { name: "US Dollar ($)", symbol: "$" as const },
    { name: "Euro (€)", symbol: "€" as const },
    { name: "British Pound (£)", symbol: "£" as const },
    { name: "Japanese Yen (¥)", symbol: "¥" as const }
  ];

  return (
    <div id="settings-screen" className="space-y-8 animate-fade-in">
      
      {/* Step / Header bar */}
      <div className="flex items-center gap-2 mb-1">
        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
        <h2 className="text-sm font-mono font-bold tracking-wider text-indigo-400 uppercase">SYSTEM • CONTROL & SETTINGS DESK</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Underwriting Assumptions Form & Preferences (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section: Ratios standards and thresholds */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="font-sans font-bold text-white text-sm">Underwriting Benchmarks</h3>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Customize default thresholds for liquid assets & financial leverage</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              
              {/* Target Current Ratio */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-mono font-medium flex justify-between">
                  <span>Target Current Ratio (Liquidity)</span>
                  <span className="text-indigo-400 font-bold">{settings.targetCurrentRatio.toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="4.0"
                  step="0.1"
                  value={settings.targetCurrentRatio}
                  onChange={(e) => onUpdateSettings({ targetCurrentRatio: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 bg-zinc-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
                <p className="text-[9px] text-zinc-500 leading-normal">
                  Ratios below this target will be flagged as warning/critical in the liqudity dashboard cards.
                </p>
              </div>

              {/* Max Debt to Equity */}
              <div className="space-y-1.5 mt-4">
                <label className="text-xs text-zinc-400 font-mono font-medium flex justify-between">
                  <span>Maximum Debt-to-Equity (Solvency)</span>
                  <span className="text-indigo-400 font-bold">{settings.maxDebtToEquity.toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={settings.maxDebtToEquity}
                  onChange={(e) => onUpdateSettings({ maxDebtToEquity: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 bg-zinc-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
                <p className="text-[9px] text-zinc-500 leading-normal">
                  Debt-to-equity leverage metrics exceeding this baseline will flag risk exposures in structural analysis.
                </p>
              </div>

              {/* Tax Standardization Rate */}
              <div className="space-y-1.5 mt-4">
                <label className="text-xs text-zinc-400 font-mono font-medium flex justify-between">
                  <span>Standard Corporate Tax Rate</span>
                  <span className="text-indigo-400 font-bold">{settings.taxStandardizationRate}%</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={settings.taxStandardizationRate}
                  onChange={(e) => onUpdateSettings({ taxStandardizationRate: parseInt(e.target.value) || 21 })}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white font-mono text-xs rounded-xl p-2.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>

            </CardContent>
          </Card>

          {/* Section: Themes, accents, currency */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="font-sans font-bold text-white text-sm">Aesthetic Customization</h3>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Configure currency standard and active accent highlights</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              
              {/* Theme Selector */}
              <div className="space-y-2">
                <span className="text-xs text-zinc-400 font-mono">Accent Palette</span>
                <div className="grid grid-cols-5 gap-2">
                  {colors.map((color) => {
                    const isSelected = settings.accentColor === color.value;
                    return (
                      <button
                        key={color.name}
                        onClick={() => onUpdateSettings({ accentColor: color.value })}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? "border-indigo-500 bg-zinc-950"
                            : "border-zinc-850 hover:border-zinc-800 bg-zinc-950/40"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                        <span className="text-[9px] font-mono text-zinc-400 font-medium">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Currency Symbol Selection */}
              <div className="space-y-2 mt-4">
                <span className="text-xs text-zinc-400 font-mono">Currency Format Denominator</span>
                <div className="grid grid-cols-2 gap-2">
                  {currencies.map((curr) => {
                    const isSelected = settings.currencySymbol === curr.symbol;
                    return (
                      <button
                        key={curr.name}
                        onClick={() => onUpdateSettings({ currencySymbol: curr.symbol })}
                        className={`px-3 py-2 text-xs font-mono rounded-xl border text-left transition-all flex justify-between items-center ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-950/5 text-white"
                            : "border-zinc-850 bg-zinc-950/40 text-zinc-400 hover:bg-zinc-900/30"
                        }`}
                      >
                        <span>{curr.name}</span>
                        <span className="font-bold text-indigo-400">{curr.symbol}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Live Logger Telemetry Logs Terminal (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal className="h-4.5 w-4.5 text-indigo-400" />
                  <h3 className="font-sans font-bold text-white text-sm">Live System Audit Telemetry</h3>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Real-time action telemetry, parsing state trackers, and API payloads</p>
              </div>
              <Button
                variant="outline"
                size="xs"
                onClick={onClearLogs}
                className="text-red-400 hover:text-red-300 hover:bg-red-950/10 border-red-950/20"
              >
                <Trash2 className="h-3 w-3 mr-1.5" /> Clear Traces
              </Button>
            </CardHeader>
            
            <CardContent className="pt-0 flex-1 flex flex-col space-y-3.5">
              
              {/* Level Filter Tabs */}
              <div className="flex gap-1 bg-zinc-900/70 border border-zinc-850 p-1 rounded-xl max-w-max">
                {(["ALL", "INFO", "SUCCESS", "WARN", "ERROR"] as const).map((level) => {
                  const isSelected = filterLevel === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setFilterLevel(level)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[9px] font-bold tracking-wider transition-all ${
                        isSelected
                          ? "bg-zinc-950 text-indigo-400"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>

              {/* Console log box */}
              <div className="bg-black border border-zinc-900 rounded-xl p-4 font-mono text-[10px] h-[280px] overflow-y-auto space-y-1.5 select-text custom-scrollbar">
                {filteredLogs.length === 0 ? (
                  <div className="text-zinc-600 italic text-center py-20">
                    No matching traces recorded in this workspace section.
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    let colorClass = "text-zinc-400";
                    if (log.level === "success") colorClass = "text-emerald-400";
                    if (log.level === "warn") colorClass = "text-amber-400";
                    if (log.level === "error") colorClass = "text-red-400 font-bold";

                    return (
                      <div key={log.id} className="leading-relaxed hover:bg-zinc-950/50 p-0.5 rounded transition-all">
                        <span className="text-zinc-600">[{log.timestamp}]</span>{" "}
                        <span className="text-indigo-400/80 font-bold">[{log.source}]</span>{" "}
                        <span className={colorClass}>{log.message}</span>
                        {log.details && (
                          <pre className="text-[9px] text-zinc-500 mt-0.5 pl-4 max-w-full overflow-x-auto whitespace-pre">
                            {JSON.stringify(log.details)}
                          </pre>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Core System Server & Gemini Key Check Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Server Status check */}
            <Card variant="muted">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400">
                    <Server className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase">SERVER STATE</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {serverStatus === "idle" && <span className="text-xs font-sans text-zinc-400">Not verified</span>}
                      {serverStatus === "checking" && <span className="text-xs font-sans text-zinc-400 animate-pulse">Pinging...</span>}
                      {serverStatus === "online" && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-xs font-sans text-emerald-400 font-bold">Active ({serverPing}ms)</span>
                        </div>
                      )}
                      {serverStatus === "offline" && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                          <span className="text-xs font-sans text-red-400 font-bold">Unreachable</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={checkServerStatus}
                  className="px-2"
                >
                  <RefreshCw className={`h-3 w-3 ${serverStatus === "checking" ? "animate-spin" : ""}`} />
                </Button>
              </CardContent>
            </Card>

            {/* Ingestion Engine Check */}
            <Card variant="muted">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400">
                  <Cpu className="h-4.5 w-4.5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase">COGNITIVE ENGINE</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-xs font-sans font-bold text-zinc-300">Gemini Pro active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

      </div>

    </div>
  );
}
