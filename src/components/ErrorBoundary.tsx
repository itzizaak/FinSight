/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { logger } from "../services/logger";

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("ErrorBoundary", `Fatal interface crash caught: ${error.message}`, {
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-black text-zinc-100">
          <Card variant="danger" className="max-w-md w-full border-red-950/40 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-red-950/20 pb-3">
              <div className="p-2 bg-red-950/40 text-red-400 rounded-lg">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-sm font-mono font-bold tracking-wider text-red-400 uppercase">SYSTEM DIAGNOSTIC REPORT</h2>
                <h3 className="font-sans font-bold text-white text-base">
                  {this.props.fallbackTitle || "Execution Halt Caught"}
                </h3>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              An unexpected failure occurred while updating the financial dashboard canvas. The error has been compiled into the logs.
            </p>

            <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 max-h-[140px] overflow-auto">
              <span className="text-[10px] text-red-400 font-mono font-bold block mb-1">Stack Trace:</span>
              <pre className="text-[10px] text-zinc-500 font-mono leading-relaxed whitespace-pre-wrap">
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="danger" size="sm" onClick={this.handleReset} className="gap-2">
                <RefreshCw className="h-3.5 w-3.5" /> Force Workspace Reload
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
