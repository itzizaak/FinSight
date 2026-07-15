/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error" | "indigo" | "muted";
  className?: string;
}

export function Badge({ children, variant = "info", className = "", ...props }: BadgeProps) {
  const baseStyle = "inline-flex items-center gap-1 font-mono text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded border select-none";

  const variants = {
    info: "bg-blue-950/40 text-blue-400 border-blue-900/30",
    success: "bg-emerald-950/40 text-emerald-400 border-emerald-900/30",
    warning: "bg-amber-950/40 text-amber-400 border-amber-900/30",
    error: "bg-red-950/40 text-red-400 border-red-900/30",
    indigo: "bg-indigo-950/40 text-indigo-400 border-indigo-900/30",
    muted: "bg-zinc-900 text-zinc-500 border-zinc-800"
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
