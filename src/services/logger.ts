/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LogLevel = "info" | "warn" | "error" | "success";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: any;
}

type LogListener = (entry: LogEntry) => void;

class LoggerService {
  private logs: LogEntry[] = [];
  private listeners: Set<LogListener> = new Set();

  private createEntry(level: LogLevel, source: string, message: string, details?: any): LogEntry {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      source,
      message,
      details
    };
    
    // Maintain maximum log size to avoid memory overflow
    if (this.logs.length > 200) {
      this.logs.shift();
    }
    
    this.logs.push(entry);
    this.notifyListeners(entry);
    return entry;
  }

  private notifyListeners(entry: LogEntry) {
    this.listeners.forEach((listener) => {
      try {
        listener(entry);
      } catch (err) {
        console.error("Error in logger listener:", err);
      }
    });
  }

  public info(source: string, message: string, details?: any) {
    console.log(`[INFO] [${source}] ${message}`, details || "");
    this.createEntry("info", source, message, details);
  }

  public success(source: string, message: string, details?: any) {
    console.log(`%c[SUCCESS] [${source}] ${message}`, "color: #10b981; font-weight: bold;", details || "");
    this.createEntry("success", source, message, details);
  }

  public warn(source: string, message: string, details?: any) {
    console.warn(`[WARN] [${source}] ${message}`, details || "");
    this.createEntry("warn", source, message, details);
  }

  public error(source: string, message: string, details?: any) {
    console.error(`[ERROR] [${source}] ${message}`, details || "");
    this.createEntry("error", source, message, details);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    this.info("LoggerService", "Application audit trace logs cleared.");
  }

  public subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const logger = new LoggerService();
